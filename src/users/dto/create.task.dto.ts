interface CreateTaskDto {
  title: string;
  description: string;
  status: string; // Assuming status can be one of 'pending', 'completed', or 'in progress'
}

export default CreateTaskDto;
