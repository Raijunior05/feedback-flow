export class CreateFeedbackDto {
  content: string;   // O comentário do cliente
  projectId: string; // O ID do projeto (aquele "f3913796..." que você viu no seu GET)
}