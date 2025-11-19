import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "../../types/types";
import { Input, Button } from "../../atoms";
import { FormField } from "../../molecules";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof schema>;

type UserFormProps = {
  editingUser: User | null;
  onSubmit: (values: FormValues) => Promise<void> | void;
  onCancelEdit: () => void;
};

export default function UserForm({ editingUser, onSubmit, onCancelEdit }: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    if (editingUser) {
      setValue("name", editingUser.name);
      setValue("email", editingUser.email);
    } else {
      reset({ name: "", email: "" });
    }
  }, [editingUser, reset, setValue]);

  const submit = async (values: FormValues) => {
    await onSubmit(values);
    reset({ name: "", email: "" });
  };

  return (
    <form onSubmit={handleSubmit(submit)} style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
      <FormField error={errors.name?.message}>
        <Input placeholder="Name" {...register("name")} />
      </FormField>

      <FormField error={errors.email?.message}>
        <Input placeholder="Email" {...register("email")} />
      </FormField>

      <Button type="submit" disabled={isSubmitting} variant="primary">
        {editingUser ? "Update" : "Add"}
      </Button>

      {editingUser && (
        <Button
          type="button"
          onClick={() => {
            onCancelEdit();
            reset({ name: "", email: "" });
          }}
          variant="ghost"
        >
          Cancel
        </Button>
      )}
    </form>
  );
}

