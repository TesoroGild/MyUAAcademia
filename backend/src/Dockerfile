FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["MyUAAcademiaB.csproj", "./"]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build


FROM build AS publish
RUN dotnet publish "MyUAAcademiaB.csproj" -c Release -o /app/publish /p:UseAppHost=false


FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MyUAAcademiaB.dll"]