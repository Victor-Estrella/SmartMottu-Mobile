import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'center',
    },
    viewInput: {
      flexDirection:'row', 
      alignItems: 'center',
      justifyContent:'center', 
      marginTop:40,
      marginBottom: 12
    }, 
    input: {
      backgroundColor:'white', 
      borderWidth: 1, 
      borderColor:'black', 
      borderRadius: 5,
      padding: 2
    },
    buttonText: { fontSize: 16, 
      fontWeight: "bold", 
      textAlign: "center",
      padding: 10,
      color: "white",
    }
});

export { styles };