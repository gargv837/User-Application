import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "../../types/types";
import { Input, Button } from "../../atoms";
import { FormField } from "../../molecules";

const schema = z.object({
  phonenumber: z.string().min(1, "Phone number is required"),
});

type FormValues = z.infer<typeof schema>;

type UserFormProps = {
  editingUser: User | null;
  onSubmit: (values: FormValues) => Promise<void> | void;
  onCancelEdit: () => void;
};

export default function UserForm({
  editingUser,
  onSubmit,
  onCancelEdit,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phonenumber: "" },
  });

  useEffect(() => {
    if (editingUser) {
      setValue("phonenumber", editingUser.phonenumber);
    } else {
      reset({ phonenumber: "" });
    }
  }, [editingUser, reset, setValue]);

  const submit = async (values: FormValues) => {
    await onSubmit(values);
    reset({ phonenumber: "" });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
    >
      <FormField error={errors.phonenumber?.message}>
        <Input placeholder="Phone Number" {...register("phonenumber")} />
      </FormField>

      <Button type="submit" disabled={isSubmitting} variant="primary">
        {editingUser ? "Update" : "Add"}
      </Button>

      {editingUser && (
        <Button
          type="button"
          onClick={() => {
            onCancelEdit();
            reset({ phonenumber: "" });
          }}
          variant="ghost"
        >
          Cancel
        </Button>
      )}
    </form>
  );
}
