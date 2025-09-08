import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { ArrowRight, LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout 
            title="Selamat Datang Kembali" 
            description="Masuk untuk mengakses koleksi eksklusif Anda dan melanjutkan perjalanan mewah Anda."
        >
            <Head title="Masuk" />

            {status && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm text-emerald-800 font-light">{status}</p>
                </div>
            )}

            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="space-y-6">
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-stone-700 font-light tracking-wide text-sm uppercase">
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Masukkan email Anda"
                                    className="h-12 border-stone-300 focus:border-stone-800 focus:ring-stone-800 backdrop-blur-sm text-stone-800 placeholder:text-stone-400 rounded-none border-0 border-b-2 bg-transparent px-0 focus:ring-0"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-stone-700 font-light tracking-wide text-sm uppercase">
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink 
                                            href={request()} 
                                            className="text-xs font-light text-stone-600 hover:text-stone-800 tracking-wide uppercase" 
                                            tabIndex={5}
                                        >
                                            Lupa Kata Sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Masukkan kata sandi Anda"
                                    className="h-12 border-stone-300 focus:border-stone-800 focus:ring-stone-800 backdrop-blur-sm text-stone-800 placeholder:text-stone-400 rounded-none border-0 border-b-2 bg-transparent px-0 focus:ring-0"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3 py-4">
                                <Checkbox 
                                    id="remember" 
                                    name="remember" 
                                    tabIndex={3}
                                    className="border-stone-400 data-[state=checked]:bg-stone-800 data-[state=checked]:border-stone-800" 
                                />
                                <Label htmlFor="remember" className="text-sm font-light text-stone-600 tracking-wide">
                                    Tetap masuk
                                </Label>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-light tracking-wider uppercase text-sm transition-all duration-300 rounded-none group" 
                                tabIndex={4} 
                                disabled={processing}
                            >
                                {processing ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <span>Masuk</span>
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                )}
                            </Button>
                        </div>

                        <div className="pt-8 border-t border-stone-200">
                            <p className="text-center text-sm font-light text-stone-600 tracking-wide">
                                Baru di Berkah?{' '}
                                <TextLink 
                                    href={register()} 
                                    tabIndex={5}
                                    className="font-normal text-stone-800 hover:text-stone-600 underline underline-offset-4"
                                >
                                    Buat akun
                                </TextLink>
                            </p>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
