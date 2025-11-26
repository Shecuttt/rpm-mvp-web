"use client";

import { Switch } from "@/components/ui/switch";
import { toggleActiveCategory } from "@/lib/action/admin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function SwitchActive({
  id,
  initial,
}: {
  id: string;
  initial: boolean;
}) {
  const [value, setValue] = useState(initial);
  const router = useRouter();

  const handleChange = async (checked: boolean) => {
    setValue(checked); // update langsung biar UI responsif

    const result = await toggleActiveCategory(id, checked);

    if (!result.success) {
      toast.error("Failed updating category status");
      setValue(initial); // rollback kalau gagal
      return;
    }

    toast.success("Updated");
    router.refresh();
  };

  return <Switch checked={value} onCheckedChange={handleChange} />;
}
