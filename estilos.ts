import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },

  // Formulário de Autenticação (Cadastro e Login)
  viewInputAutenticacao: {
    marginTop: 40,
    marginBottom: 12,
  },
  inputAutenticacao: {
    backgroundColor: 'gray',
    borderRadius: 7,
    padding: 4,
    color: 'white',
    fontSize: 22,
    fontWeight: 300,
  },
  tituloAutenticacao: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 32,
    color: '#00b131'
  },
  buttonTextAutenticacao: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    color: "white",
  },

  // Formulário de Cadastro de Motos
  viewInputFormulario: {
    flexDirection: 'column',
    marginTop: 12,
  },
  input: {
    backgroundColor: '#5D5D5D',
    borderRadius: 8,
    padding: 4,
    color: 'white',
    fontSize: 18,
  },
  labelFormulario: {
    color: 'white',
    fontSize: 22,
    fontWeight: 200,
  },
  tituloFormulario: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 24,
    color: '#00b131',
    textAlign: 'center',
  },
  botao: {
    borderRadius: 16,
    marginTop: 42,
    backgroundColor: 'green'
  },
  botaoTexto: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
    color: "white",
  },


  // Listagem de Motos
  tabelaContainer: {
    padding: 16,
    minWidth: 400
  },
  tituloTabela: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#00b131"
  },
  cabecalhoTabela: {
    flexDirection: "row",
    backgroundColor: "#eee",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cabecalhoTextoTabela: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  linhaTabela: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#333",
    paddingVertical: 8,
  },
  objetosTabela: {
    flex: 1,
    textAlign: "center",
    color: "white",
  },
  pressableDetalhesTabela: {
    flex: 1,
    alignItems: "center",
  },
  botaoDetalhes: {
    backgroundColor: "green",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTextoDetalhes: {
    color: "#fff",
    fontSize: 12,
  },


  // Configurações
  containerConfig: {
    flex: 1,
    padding: 24,
    backgroundColor: '#000',
  },
  tituloConfig: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#00b131',
  },
  inputConfig: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: 'white',
  },
  deleteConfig: {
    marginTop: 32,
    flexDirection: 'row',
    alignSelf: 'center'
  },
});

export { styles };

