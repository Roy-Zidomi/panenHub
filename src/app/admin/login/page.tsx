"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Lock, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
    email: z.string().email("Format email salah"),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setError(null);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Gagal masuk");
            }

            router.push("/admin/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md shadow-lg border-none">
                <CardHeader className="space-y-2 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                            <Store className="h-10 w-10" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">PanenHub Admin</CardTitle>
                    <CardDescription>
                        Silakan masuk untuk mengelola marketplace Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm border border-red-100 italic">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@panenhub.com"
                                    className="pl-10"
                                    {...register("email")}
                                    aria-invalid={!!errors.email}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    {...register("password")}
                                    aria-invalid={!!errors.password}
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 text-base transition-all"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : "Masuk ke Dashboard"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
