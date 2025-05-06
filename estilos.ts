import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'center',
    },
    viewInputAutenticacao: {
      flexDirection:'row', 
      alignItems: 'center',
      justifyContent:'center', 
      marginTop:40,
      marginBottom: 12,
    }, 
    inputAutenticacao: {
      backgroundColor:'gray', 
      borderRadius: 7,
      padding: 4,
      color: 'white',
      fontSize: 22,
      fontWeight: 300,
      width: '50%',
    },
    tituloAutenticacao: {
      fontSize:48, 
      fontWeight: 'bold', 
      marginTop: 32, 
      color:'#00b131'
    },
    buttonTextAutenticacao: { 
      fontSize: 30, 
      fontWeight: "bold", 
      textAlign: "center",
      padding: 10,
      color: "white",
    }
});

export { styles };