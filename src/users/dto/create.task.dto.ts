interface CreateTaskDto {
  title: string;
  description: string;
  status: string; // Status can be one of 'pending', 'completed', or 'in progress'
}

export default CreateTaskDto;
