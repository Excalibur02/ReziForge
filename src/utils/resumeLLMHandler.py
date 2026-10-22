import requests
import json
from typing import Optional, Any
from pydantic import ValidationError
from src.models.models import ResumeParsed, TailoredResume
from src.utils.prompts import (
    PARSE_RESUME_PROMPT_TEMPLATE, 
    EXTRACT_JD_KEYWORDS_PROMPT_TEMPLATE, 
    ENHANCE_RESUME_PROMPT_TEMPLATE
)
from src.config.settings import settings
from src.config.logging import logger
from src.utils.extractPdf import pdfExtractor


class ResumeLLMHandler:
    def __init__(self):
        self.api_key = settings.openrouter_api_key
        self.pdfExtractor = pdfExtractor
        if not self.api_key:
            logger.warning("OPENROUTER_API_KEY is not set.")

    async def _llm_handler_openrouter(self, prompt: str) -> Optional[Any]:
        """
        Manages the LLM calls to OpenRouter. Expected to return a JSON dictionary or list.
        """
        try:
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                data=json.dumps({
                    "model": "dots-studio/dots-3-note-preview:free",
                    "messages": [
                        { 
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    # "reasoning": {"enabled": True}
                }),
                timeout=30
            )
            response.raise_for_status()
            response_json = response.json()
            message = response_json.get('choices', [{}])[0].get('message', {})
            result = message.get('content', '')
            
            if result:
                if "```json" in result:
                    result = result.split("```json")[-1].split("```")[0].strip()
                elif result.startswith("```"):
                    result = result.strip("```\n").strip("```").strip()
                return json.loads(result)
            else:
                raise ValueError("The API response did not contain a valid candidate text.")

        except requests.exceptions.RequestException as e:
            raise Exception(f"Error during API call: {e}\nResponse: {getattr(e.response, 'text', '')}")
        except json.JSONDecodeError as e:
            raise Exception(f"Error decoding JSON from API response: {e}\nResponse was: {result}")
        except Exception as e:
            raise Exception(f"An unexpected error occurred in LLM generation: {e}")


    async def _llm_handler_g4f(self, prompt: str) -> Optional[Any]:
        payload = {
            "model": "models/gemini-3-flash-preview",
            "temperature": 0.1,
            "messages": [{"role": "user", "content": prompt}]
        } 

        try:
            response = requests.post("https://g4f.space/api/gemini/chat/completions", json=payload)

            if response.status_code == 200:
                response_json = response.json()
                message = response_json.get('choices', [{}])[0].get('message', {})
            result = message.get('content', '')

            if result:
                if "```json" in result:
                    result = result.split("```json")[-1].split("```")[0].strip()
                elif result.startswith("```"):
                    result = result.strip("```\n").strip("```").strip()
                return json.loads(result)
            else:
                raise ValueError("The API response did not contain a valid candidate text.")

        except requests.exceptions.RequestException as e:
            raise Exception(f"Error during API call: {e}\nResponse: {getattr(e.response, 'text', '')}")
        except json.JSONDecodeError as e:
            raise Exception(f"Error decoding JSON from API response: {e}\nResponse was: {result}")
        except Exception as e:
            raise Exception(f"An unexpected error occurred in LLM generation: {e}")
        

    async def _llm_handler(self, prompt: str) -> Optional[Any]:
        provider = "openrouter"
        if provider == "openrouter":
            return await self._llm_handler_openrouter(prompt)
        elif provider == "g4f":
            return await self._llm_handler_g4f(prompt)
        else:
            raise ValueError("Invalid provider. Choose from 'openrouter' or 'g4f'.")
    
    
    async def parse_resume_from_text(self, resume_text: str) -> Optional[ResumeParsed | Any]:
        prompt = PARSE_RESUME_PROMPT_TEMPLATE.replace("{resume_text}", resume_text)
        parsed_data = await self._llm_handler(prompt)
        if parsed_data and isinstance(parsed_data, dict):
            try:
                return TailoredResume(**parsed_data)
            except ValidationError as e:
                missing_fields = [err['loc'][0] for err in e.errors() if err['type'] == 'missing']
                logger.error(f"Validation failed for TailoredResume. Missing fields: {missing_fields}")
                logger.error(f"Full parsed data from LLM: {parsed_data}")
                raise e
        return None


    async def extract_jd_keywords(self, jd_text: str) -> list[str]:
        prompt = EXTRACT_JD_KEYWORDS_PROMPT_TEMPLATE.replace("{jd_text}", jd_text)
        parsed_data = await self._llm_handler(prompt)
        
        if isinstance(parsed_data, list):
            return parsed_data
        return []


    async def enhance_resume(self, resume_data: dict, jd_text: str) -> Optional[TailoredResume]:
        if isinstance(resume_data, str):
            resume_data = json.loads(resume_data)
        prompt = ENHANCE_RESUME_PROMPT_TEMPLATE.replace("{jd_text}", jd_text).replace("{resume_data_json}", json.dumps(resume_data))
        parsed_data = await self._llm_handler(prompt)
        logger.info(f"Enhanced resume data: {parsed_data}")
        logger.info(f"Original resume data: {resume_data}")
        # logger.info(f"resume_data type : {type(resume_data)}")
        if parsed_data and isinstance(parsed_data, dict):
            # Copy contact info from original
            parsed_data["name"] = resume_data.get("name") or parsed_data.get("name", "")
            parsed_data["email"] = resume_data.get("email") or parsed_data.get("email", "")
            parsed_data["phone"] = resume_data.get("phone") or parsed_data.get("phone", "")
            parsed_data["github"] = resume_data.get("github") or parsed_data.get("github", "")
            parsed_data["linkedin"] = resume_data.get("linkedin") or parsed_data.get("linkedin", "")
            parsed_data["codechef_profile_link"] = resume_data.get("codechef_profile_link") or parsed_data.get("codechef_profile_link", "")
            parsed_data["leetcode_profile_link"] = resume_data.get("leetcode_profile_link") or parsed_data.get("leetcode_profile_link", "")
            parsed_data["codeforces_profile_link"] = resume_data.get("codeforces_profile_link") or parsed_data.get("codeforces_profile_link", "")
            parsed_data["hackerrank_profile_link"] = resume_data.get("hackerrank_profile_link") or parsed_data.get("hackerrank_profile_link", "")
            
            # Copy other sections unharmed
            parsed_data["summary"] = parsed_data.get("summary", None)
            parsed_data["projects"] = parsed_data.get("projects") or resume_data.get("projects", []) 
            parsed_data["positions_of_responsibility"] = parsed_data.get("positions_of_responsibility") or resume_data.get("positions_of_responsibility", [])
            parsed_data["achievements"] = parsed_data.get("achievements") or resume_data.get("achievements", [])
            parsed_data["extra_curricular_activities"] = parsed_data.get("extra_curricular_activities") or resume_data.get("extra_curricular_activities", []) 
            
            # logger.info(f"Enhanced resume data: {parsed_data}")
            try:
                return TailoredResume(**parsed_data)
            except ValidationError as e:
                missing_fields = [err['loc'][0] for err in e.errors() if err['type'] == 'missing']
                logger.error(f"Validation failed for Enhanced TailoredResume. Missing fields: {missing_fields}")
                logger.error(f"Full parsed data from LLM: {parsed_data}")
                raise e
        return None
    

    async def get_resume_content(self, pdf_file: str) -> str:
        resume_content_markdown = await pdfExtractor.get_markdown(pdf_file, make_md=False)
        return resume_content_markdown


    async def basic_resume_json(self, resume_file: str) -> str:
        resume_content = await self.get_resume_content(resume_file)
        resume_data = await self.parse_resume_from_text(resume_content)
        if resume_data is None:
            raise Exception("Failed to parse resume from text. Please check the API exception output above.")
        return json.dumps(resume_data.model_dump())


    async def enhanced_resume_json(self, resume_file: str, jd_text: str) -> str:
        resume_data = await self.basic_resume_json(resume_file)
        if resume_data is None:
            raise Exception("Failed to parse resume from text. Please check the API exception output above.")
        enhanced_resume = await self.enhance_resume(resume_data, jd_text)
        if enhanced_resume is None:
            raise Exception("Failed to enhance resume. Please check the API exception output above.")
        return json.dumps(enhanced_resume.model_dump())
    
