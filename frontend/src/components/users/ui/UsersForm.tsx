import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "../types/types";
import { inputStyle, buttonPrimary, buttonGhost, sectionGap } from "../styles/styles";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof schema>;

type UsersFormProps = {
  editingUser: User | null;
  onSubmit: (values: FormValues) => Promise<void> | void;
  onCancelEdit: () => void;
};

export default function UsersForm({ editingUser, onSubmit, onCancelEdit }: UsersFormProps) {
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
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <input placeholder="Name" {...register("name")} style={inputStyle} />
        {errors.name && <span style={{ color: "red", fontSize: 12 }}>{errors.name.message}</span>}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <input placeholder="Email" {...register("email")} style={inputStyle} />
        {errors.email && <span style={{ color: "red", fontSize: 12 }}>{errors.email.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting} style={buttonPrimary}>{editingUser ? "Update" : "Add"}</button>

      {editingUser && (
        <button
          type="button"
          onClick={() => {
            onCancelEdit();
            reset({ name: "", email: "" });
          }}
          style={buttonGhost}
        >
          Cancel
        </button>
      )}
    </form>
  );
}


