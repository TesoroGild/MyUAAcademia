using Microsoft.AspNetCore.Mvc;
using MyUAAcademiaB.Data;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Interfaces;
using MyUAAcademiaB.Models;
using System;

namespace MyUAAcademiaB.Services
{
    public class FileService : IFileService
    {
        private readonly string _basePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
        private readonly DataContext _context;

        public FileService(DataContext context)
        {
            _context = context;
        }

        public async Task<string> SaveFileAsync(IFormFile file, string folder, string code, string filetype)
        {
            //private readonly string 
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads/" + folder);
            var fileCode = Guid.NewGuid().ToString("N");
            var fileName = file.FileName;
            var fullPath = Path.Combine(basePath, code, fileName);

            Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            var fileInfos = new StudentFiles
            {
                FileCode = fileCode,
                StudentCode = code, // Will be set after the student is created
                FileName = fileName,
                ContentType = file.ContentType,
                FileType = filetype,
                UploadedAt = DateTime.UtcNow
            };

            _context.StudentFiles.Add(fileInfos);
            await _context.SaveChangesAsync();

            return fileName;
        }

        public List<FilesDto> GetFiles(string code, string folder)
        {
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads/" + folder, code);

            if (!Directory.Exists(folderPath))
                return [];

            var files = Directory.GetFiles(folderPath)
                .Select(file => new FilesDto
                {
                    FileName = Path.GetFileName(file),
                    Url = $"~/Uploads/{folder}/{code}/{Path.GetFileName(file)}"
                })
                .ToList();

            return files;

        }

        public Task<bool> DeleteFileAsync(string path)
        {
            var fullPath = Path.Combine(_basePath, path);
            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }
    }
}
