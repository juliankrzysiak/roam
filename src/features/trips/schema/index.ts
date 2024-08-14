import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(2).max(50),
  dateRange: z.object(
    {
      from: z.date(),
      to: z.date(),
      datesWithPlaces: z.date().array(),
    },
    { required_error: "Must have a start date." },
  ),
});
