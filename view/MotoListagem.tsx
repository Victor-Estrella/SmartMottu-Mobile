import { Moto } from "../model/Moto";
import { FlatList, Pressable, Text, View } from "react-native";
import { BotaoProps } from "../model/Botao";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { styles } from "../styles/estilos";
import { useThemeGlobal } from '../styles/ThemeContext';
import { useMoto } from "../contexto/MotoContext";
import { useTranslation } from 'react-i18next';

interface MotoPropsExtra {
  item: Moto;
  navigation: NavigationProp<ParamListBase>;
}

const MotoProps = ({ item, navigation }: MotoPropsExtra): React.ReactElement => {
  const { theme } = useThemeGlobal();
  const { t } = useTranslation();
  const setorLabel = item.setor ? t(`moto.sectors.${item.setor}`) : '';
  return (
    <View style={[styles.linhaTabela, {backgroundColor: theme.card}]}> 
      <Text style={[styles.objetosTabela, {color: theme.text}]}>{setorLabel || item.setor}</Text>
      <Text style={[styles.objetosTabela, {color: theme.text}]}>{item.idMoto}</Text>
      <Text style={[styles.objetosTabela, {color: theme.text}]}>{item.modelo}</Text>
      {/* Passa apenas o idMoto para a tela de detalhes */}
      <Botao title={t('moto.list.details')} onPress={() => navigation.navigate("MotoDetalhes", { idMoto: item.idMoto })} theme={theme} />
    </View>
  );
};

const ListagemMoto = ({ navigation }: { navigation: any }): React.ReactElement => {
  const { listaMoto } = useMoto();
  const { theme } = useThemeGlobal();
  const { t } = useTranslation();
  return (
    <View style={{ backgroundColor: theme.background, flex: 1 }}>
      <Text style={[styles.tituloTabela, {color: theme.primary}]}>{t('moto.list.title')}</Text>
      <View style={[styles.cabecalhoTabela, {backgroundColor: theme.card}]}> 
        <Text style={[styles.cabecalhoTextoTabela, {color: theme.text}]}>{t('moto.list.headers.sector')}</Text>
        <Text style={[styles.cabecalhoTextoTabela, {color: theme.text}]}>{t('moto.list.headers.id')}</Text>
        <Text style={[styles.cabecalhoTextoTabela, {color: theme.text}]}>{t('moto.list.headers.model')}</Text>
        <Text style={[styles.cabecalhoTextoTabela, {color: theme.text}]}>{t('moto.list.headers.action')}</Text>
      </View>
      <FlatList
        style={styles.tabelaContainer}
        data={listaMoto}
        renderItem={({ item }) => <MotoProps item={item} navigation={navigation} />}
        keyExtractor={item => String(item.idMoto ?? item.nmChassi ?? Math.random())}
        ListEmptyComponent={<Text style={{color: theme.text, textAlign: 'center', marginTop: 20}}>{t('moto.list.empty')}</Text>}
      />
    </View>
  );
};

function Botao(props: BotaoProps & { theme: any }) {
  return (
    <Pressable onPress={props.onPress} style={styles.pressableDetalhesTabela}>
      <View style={[styles.botaoDetalhes, {backgroundColor: props.theme.button}]}> 
        <Text style={[styles.botaoTextoDetalhes, {color: props.theme.buttonText}]}>{props.title}</Text>
      </View>
    </Pressable>
  );
}

export { ListagemMoto };
