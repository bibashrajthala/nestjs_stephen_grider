import { IsLongitude, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReportDto {
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @IsLongitude()
  lng: number;

  @IsLongitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}