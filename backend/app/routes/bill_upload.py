from fastapi import APIRouter, UploadFile, File, HTTPException
from PyPDF2 import PdfReader
import io
from ..models import BillDocument, get_db
from ..services.llm_service import LLMService

router = APIRouter(prefix="/api/bill", tags=["bill"])
llm_service = LLMService()

@router.post("/upload")
async def upload_bill(file: UploadFile = File(...)):
    """Upload and summarize a bill PDF"""
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    # Read PDF content
    contents = await file.read()
    pdf_file = io.BytesIO(contents)
    pdf_reader = PdfReader(pdf_file)
    
    # Extract text
    text_content = ""
    for page in pdf_reader.pages:
        text_content += page.extract_text()
    
    # Generate summary using LLM
    summary_prompt = f"Summarize the following bill in 200 words:\n\n{text_content[:3000]}"
    summary = await llm_service.generate(summary_prompt)
    
    # Generate key points
    key_points_prompt = f"Extract 5 key points from this bill:\n\n{text_content[:3000]}"
    key_points_response = await llm_service.generate(key_points_prompt)
    key_points = [p.strip() for p in key_points_response.split('\n') if p.strip()][:5]
    
    # Generate advantages
    advantages_prompt = f"List 3 advantages of this bill:\n\n{text_content[:3000]}"
    advantages_response = await llm_service.generate(advantages_prompt)
    advantages = [a.strip() for a in advantages_response.split('\n') if a.strip()][:3]
    
    # Generate disadvantages
    disadvantages_prompt = f"List 3 disadvantages or concerns about this bill:\n\n{text_content[:3000]}"
    disadvantages_response = await llm_service.generate(disadvantages_prompt)
    disadvantages = [d.strip() for d in disadvantages_response.split('\n') if d.strip()][:3]
    
    # Generate economic impact
    economic_prompt = f"Describe the economic impact of this bill in 100 words:\n\n{text_content[:3000]}"
    economic_impact = await llm_service.generate(economic_prompt)
    
    # Generate social impact
    social_prompt = f"Describe the social impact of this bill in 100 words:\n\n{text_content[:3000]}"
    social_impact = await llm_service.generate(social_prompt)
    
    # Generate AI recommendation
    recommendation_prompt = f"Provide an AI recommendation on whether this bill should be passed (Pass/Reject/Amend) with reasoning:\n\n{text_content[:3000]}"
    ai_recommendation = await llm_service.generate(recommendation_prompt)
    
    return {
        "title": file.filename.replace('.pdf', ''),
        "summary": summary,
        "key_points": key_points,
        "advantages": advantages,
        "disadvantages": disadvantages,
        "economic_impact": economic_impact,
        "social_impact": social_impact,
        "ai_recommendation": ai_recommendation
    }