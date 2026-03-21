using AutoMapper;
using MyUAAcademiaB.Dto;
using MyUAAcademiaB.Models;

namespace MyUAAcademiaB.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Bills, BillDto>();
            CreateMap<BillDto, Bills>();
            CreateMap<Bulletins, BulletinDto>();
            CreateMap<BulletinDto, Bulletins>();
            CreateMap<Classes, ClasseDto>();
            CreateMap<ClasseDto, Classes>();
            CreateMap<ClassesCourses, ClasseCourseDto>();
            CreateMap<ClasseCourseDto, ClassesCourses>();
            CreateMap<Courses, CourseDto>();
            CreateMap<CourseDto, Courses>();
            CreateMap<Courses, CoursePriceDto>();
            CreateMap<CoursePriceDto, Courses>();
            CreateMap<Employees, EmployeeTCDto>();
            //CreateMap<EmployeeDto, Employees>();
            //CreateMap<EmployeeDto, Employees>()
            //    .ForMember(dest => dest.BirthDay, opt => opt.MapFrom<StringToDateOnlyResolver>())
            //    .ForMember(dest => dest.DateOfTakingOffice, opt => opt.MapFrom<StringToDateOnlyResolver>())
            //    .ForMember(dest => dest.EndDateOfFunction, opt => opt.MapFrom<StringToNullableDateOnlyResolver>());
            CreateMap<EmployeeTCDto, Employees>()
                .ForMember(dest => dest.BirthDay, opt => opt.MapFrom(src => DateOnly.ParseExact(src.BirthDay, "yyyy-MM-dd")));
            //.ForMember(dest => dest.DateOfTakingOffice, opt => opt.MapFrom(src => DateOnly.ParseExact(src.DateOfTakingOffice, "yyyy-MM-dd")))
            //.ForMember(dest => dest.EndDateOfFunction, opt => opt.MapFrom(src => string.IsNullOrWhiteSpace(src.EndDateOfFunction) ? (DateOnly?)null : DateOnly.ParseExact(src.EndDateOfFunction, "yyyy-MM-dd")));
            CreateMap<Employees, EmployeeCoDto>();
            CreateMap<EmployeeCoDto, Employees>();
            CreateMap<Employees, EmployeeTDDto>();
            CreateMap<EmployeeTDDto, Employees>();
            CreateMap<Programs, ProgramDto>();
            CreateMap<ProgramDto, Programs>();
            CreateMap<Users, UserTCDto>();
            CreateMap<UserTCDto, Users>()
                .ForMember(dest => dest.BirthDay, opt => opt.MapFrom(src => DateOnly.ParseExact(src.BirthDay, "yyyy-MM-dd")));
            CreateMap<Users, UserTDDto>()
                .ForMember(dest => dest.BirthDay, opt => opt.MapFrom(src => src.BirthDay.ToString()));
            CreateMap<UserTDDto, Users>();
            CreateMap<Users, UserV2Dto>();
            CreateMap<UserV2Dto, Users>();
            CreateMap<Users, UserV3Dto>();
            CreateMap<UserV3Dto, Users>();
            CreateMap<UserCourse, UserCourseDto>();
            CreateMap<UserCourseDto, UserCourse>();
            CreateMap<UserProgramEnrollment, UserProgramEnrollmentDto>();
            CreateMap<UserProgramEnrollmentDto, UserProgramEnrollment>();
            CreateMap<Users, StudentCoDto>();
            CreateMap<StudentCoDto, Users>();
            CreateMap<Contracts, ContractTCDto>();
            CreateMap<ContractTCDto, Contracts>();
        }
    }
}
