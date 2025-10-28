import { NavigationProp, ParamListBase } from "@react-navigation/native";

export default interface LoginProps {
    navigation: NavigationProp<ParamListBase>;
    onLogin: (email: string, senha: string) => Promise<void>;
}