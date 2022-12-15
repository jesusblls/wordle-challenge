export class CompareResponseDto {
  request_body: string;
  response?: WordPoints[];
}

export class WordPoints {
  letter?: string;
  points?: number;
}
