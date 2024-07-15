from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import UploadedFile
from django.conf import settings
from django.http import FileResponse
from .serializers import UploadedFileSerializer

import transformers    
import pandas as pd
import torch
import re


def convert_natural_language_to_regex(natural_language):
    prompt = """Given this example
    Input: Find email addresses in the Email column and replace the, with 'REDACTED'. 
    Output: \\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\\b Replacement: REDACTED 
    Now convert the following natural language description into a regex pattern and provide a replacement value, return the output only: """ + natural_language
    
    # HuggingFace
    model_id = "meta-llama/Meta-Llama-3-8B-Instruct"
    hf_access_token = settings.HUGGINGFACE_API_KEY
    pipeline = transformers.pipeline(
        "text-generation",
        model=model_id,
        model_kwargs={"torch_dtype": torch.bfloat16},
        token=hf_access_token,
        device_map="auto",
    )

    messages = [
        {"role": "system", "content": "You are a regex pattern generator."},
        {"role": "user", "content": prompt},
    ]

    terminators = [
        pipeline.tokenizer.eos_token_id,
        pipeline.tokenizer.convert_tokens_to_ids("<|eot_id|>")
    ]

    outputs = pipeline(
        messages,
        max_new_tokens=256,
        eos_token_id=terminators,
        do_sample=True,
        temperature=0.6,
        top_p=0.9,
    )
    
    response_text = outputs[0]["generated_text"][-1]['content'].strip()
    pattern, replacement = response_text.split("Replacement: ")
    return pattern.strip(), replacement.strip()


class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_serializer = UploadedFileSerializer(data=request.data)
        if file_serializer.is_valid():
            file_instance = file_serializer.save()
            file_path = file_instance.file.path

            if file_instance.file.name.endswith('.xlsx'):
                df = pd.read_excel(file_path)
            else:
                df = pd.read_csv(file_path)

            # Convert DataFrame to JSON
            data = df.to_dict(orient='records')
            
            return Response({"id": file_instance.id, "data": data}, status=201)
        else:
            return Response(file_serializer.errors, status=400)


class RegexProcessView(APIView):
    
    def post(self, request, *args, **kwargs):
        natural_language = request.data.get("input")
        file_id = request.data.get("file_id")
        
        regex_pattern, replacement = convert_natural_language_to_regex(natural_language)
        
        file_instance = UploadedFile.objects.get(id=file_id)
        df = pd.read_excel(file_instance.file.path) if file_instance.file.name.endswith('.xlsx') else pd.read_csv(file_instance.file.path)
        
        for column in df.select_dtypes(include=['object']).columns:
            df[column] = df[column].apply(lambda x: re.sub(regex_pattern, replacement, x))
            
        processed_csv = df.to_csv(index=False)

        return Response({
            "message": "File processed successfully",
            "processed_file": processed_csv,
            "regex_pattern": regex_pattern,
            "replacement": replacement
        })