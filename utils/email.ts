export function validarEmail(email: string): boolean {
    return /^\S+@\S+\.\S+$/.test(email);
}
