import { z } from 'zod'

export const LATEST_SAVE_VERSION = 2

export const SaveSchema = z.object({
  version: z.number(),
  exportedAt: z.preprocess((arg: string) => new Date(arg), z.date()),
  // tasks sama checkins sengaja any biar bisa migrations stuff i think
  tasks: z.any(),
  checkins: z.any(),
})
export type SaveType = z.infer<typeof SaveSchema>

export const TaskSchema = z.object({
  id: z.string(),
  task: z.string(),
  url: z.union([z.literal(""), z.url()]),
  refreshTime: z.int().min(-12).max(14),
  lastCheckin: z.preprocess((arg) => {
    if (typeof arg === "string") {
      return new Date(arg)
    }
    return null;
  }, z.date().nullable()),
});
export type TaskType = z.infer<typeof TaskSchema>

export const TasksSchema = z.array(TaskSchema)
export type TasksType = z.infer<typeof TasksSchema>

export const CheckinSchema = z.object({
  id: z.string(),
  taskId: z.string(),
  time: z.preprocess((arg: string) => new Date(arg), z.date()),
})
export type CheckinType = z.infer<typeof CheckinSchema>

export const CheckinsSchema = z.array(CheckinSchema)
export type CheckinsType = z.infer<typeof CheckinsSchema>
