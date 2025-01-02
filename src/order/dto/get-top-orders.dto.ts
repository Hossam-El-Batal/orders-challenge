import { IsString } from "class-validator";

export class GetTopOrdersDTO {
  @IsString()
  city: string;
}