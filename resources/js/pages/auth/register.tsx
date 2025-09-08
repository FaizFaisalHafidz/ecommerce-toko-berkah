import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { ArrowRight, LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout 
            title="Buat Akun" 
            description="Bergabunglah dengan komunitas eksklusif kami dan temukan koleksi terbaik dari produk kulit buatan tangan."
        >
            <Head title="Buat Akun" />
            
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-stone-700 font-light tracking-wide text-sm uppercase">
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Masukkan nama lengkap Anda"
                                    className="h-12 border-stone-300 focus:border-stone-800 focus:ring-stone-800 backdrop-blur-sm text-stone-800 placeholder:text-stone-400 rounded-none border-0 border-b-2 bg-transparent px-0 focus:ring-0"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-stone-700 font-light tracking-wide text-sm uppercase">
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="Masukkan alamat email Anda"
                                    className="h-12 border-stone-300 focus:border-stone-800 focus:ring-stone-800 backdrop-blur-sm text-stone-800 placeholder:text-stone-400 rounded-none border-0 border-b-2 bg-transparent px-0 focus:ring-0"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-stone-700 font-light tracking-wide text-sm uppercase">
                                    Kata Sandi
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Buat kata sandi yang aman"
                                    className="h-12 border-stone-300 focus:border-stone-800 focus:ring-stone-800 backdrop-blur-sm text-stone-800 placeholder:text-stone-400 rounded-none border-0 border-b-2 bg-transparent px-0 focus:ring-0"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-stone-700 font-light tracking-wide text-sm uppercase">
                                    Konfirmasi Kata Sandi
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Konfirmasi kata sandi Anda"
                                    className="h-12 border-stone-300 focus:border-stone-800 focus:ring-stone-800 backdrop-blur-sm text-stone-800 placeholder:text-stone-400 rounded-none border-0 border-b-2 bg-transparent px-0 focus:ring-0"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="pt-4">
                                <p className="text-xs font-light text-stone-600 leading-relaxed mb-6">
                                    Dengan membuat akun, Anda menyetujui{' '}
                                    <TextLink href="#" className="text-stone-800 underline underline-offset-2">
                                        Syarat & Ketentuan
                                    </TextLink>
                                    {' '}dan{' '}
                                    <TextLink href="#" className="text-stone-800 underline underline-offset-2">
                                        Kebijakan Privasi
                                    </TextLink>
                                    {' '}kami.
                                </p>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-light tracking-wider uppercase text-sm transition-all duration-300 rounded-none group" 
                                tabIndex={5}
                                disabled={processing}
                            >
                                {processing ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <span>Buat Akun</span>
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                )}
                            </Button>
                        </div>

                        <div className="pt-8 border-t border-stone-200">
                            <p className="text-center text-sm font-light text-stone-600 tracking-wide">
                                Sudah punya akun?{' '}
                                <TextLink 
                                    href={login()} 
                                    tabIndex={6}
                                    className="font-normal text-stone-800 hover:text-stone-600 underline underline-offset-4"
                                >
                                    Masuk di sini
                                </TextLink>
                            </p>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
