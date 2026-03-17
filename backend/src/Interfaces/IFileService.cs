using MyUAAcademiaB.Dto;

namespace MyUAAcademiaB.Interfaces
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(IFormFile file, string folder, string code, string fileType);
        List<FilesDto> GetFiles(string code, string folder);
        Task<bool> DeleteFileAsync(string path);
    }
}
