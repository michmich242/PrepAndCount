import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    SafeAreaView,
    TextComponent,
} from 'react-native';
import { DMContext } from "../../app/_layout";
import { StyleSheet } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import PieChart from 'react-native-pie-chart'
import { useNavigation } from 'expo-router';
import { formatDiagnostic } from 'typescript';
import { Dropdown } from 'react-native-element-dropdown';
import { useMacros } from '../../hooks/macroContext.js';

export default function MacrosScreen( { route } ) {
    const { state, dispatch } = useMacros();

    const food_info = route.params.food_info; // first index holds name, second index holds brand name, third index holds serving array
    let { protein, 
        fat, 
        carbohydrate, 
        fiber, 
    } = route.params;

    let net_carb = carbohydrate

    
    if(fiber){
        net_carb -= fiber;
    }

    protein = Math.round(protein);
    fat = Math.round(fat);
    net_carb = Math.round(net_carb);

    const protein_percentage = Math.round((100 * (protein/(protein + fat + net_carb))));
    const fat_percentage = Math.round((100 * (fat/(protein + fat + net_carb))));
    const net_carb_percentage = Math.round((100 * (net_carb/(protein + fat + net_carb))))




    const navigation = useNavigation();
    const widthAndHeight = 125;
    let index = 0;

    let servingOptions = food_info[2].serving.map((item) => ({
        label: item.serving_description,
        amount: item.metric_serving_amount    
    }));

    const [quantity, setQuantity] = useState(1);
    const[totalCalories, setTotalCalories] = useState(food_info[2].serving[0].calories);
    const[macros, setMacros] = useState([
        { value: -1, color: '#fbd203' },
        { value: -1, color: '#ffb300' },
        { value: -1, color: '#ff9100' },
    ]);
    
    const [nutrition, setNutrition] = useState([
        { label: "Protein", value: food_info[2]?.serving[0].protein, unit: "g" },
        { label: "Fat", value: food_info[2]?.serving[0].fat, unit: "g" },
        { label: "Carbohydrate", value: food_info[2]?.serving[0].carbohydrate, unit: "g" },
        { label: "Saturated Fat", value: food_info[2]?.serving[0].saturated_fat, unit: "g" },
        { label: "Unsaturated Fat", value: food_info[2]?.serving[0].unsaturated_fat, unit: "g" },
        { label: "Trans Fat", value: food_info[2]?.serving[0].trans_fat, unit: "g" },
        { label: "Sugar", value: food_info[2]?.serving[0].sugar, unit: "g" },
        { label: "Fiber", value: food_info[2]?.serving[0].fiber, unit: 'g'},
        { label: "Vitamin C", value: food_info[2]?.serving[0].vitamin_c, unit: 'mg'},
        { label: "Iron", value: food_info[2]?.serving[0].iron, unit: 'mg' },
        { label: "Vitamin A", value: food_info[2]?.serving[0].vitamin_a, unit: 'IU' },
        { label: "Sodium (mg)", value: food_info[2]?.serving[0].sodium, unit: 'mg' },
        { label: "Calcium", value: food_info[2]?.serving[0].calcium, unit: 'mg' },
        { label: "Potassium", value: food_info[2]?.serving[0].potassium, unit: 'mg' }
    ]);

    




    const[serving, setServing] = useState(servingOptions[0]);
    const [isFocus, setIsFocus] = useState(false);
    const [darkModeEnabled] = useContext(DMContext);

    
    const handleGoBack = () => {
        navigation.goBack();
    };



    function handleServingChange(index){
        //update energy summary
        setMacros([
            { value: food_info[2].serving[index].protein, color: '#fbd203' },
            { value: food_info[2].serving[index].fat, color: '#ffb300' },
            { value: food_info[2].serving[index].carbohydrate - food_info[2].serving[index].fiber, color: '#ff9100' },
        ]);

        setTotalCalories(food_info[2].serving[index].calories);

        setNutrition([
            { label: "Protein", value: food_info[2]?.serving[index].protein, unit: "g" },
            { label: "Fat", value: food_info[2]?.serving[index].fat, unit: "g" },
            { label: "Carbohydrate", value: food_info[2]?.serving[index].carbohydrate, unit: "g" },
            { label: "Saturated Fat", value: food_info[2]?.serving[index].saturated_fat, unit: "g" },
            { label: "Unsaturated Fat", value: food_info[2]?.serving[index].unsaturated_fat, unit: "g" },
            { label: "Trans Fat", value: food_info[2]?.serving[index].trans_fat, unit: "g" },
            { label: "Sugar", value: food_info[2]?.serving[index].sugar, unit: "g" },
            { label: "Fiber", value: food_info[2]?.serving[index].fiber, unit: "g" },
            { label: "Vitamin C", value: food_info[2]?.serving[index].vitamin_c, unit: "mg" },
            { label: "Iron", value: food_info[2]?.serving[index].iron, unit: "mg" },
            { label: "Vitamin A", value: food_info[2]?.serving[index].vitamin_a, unit: "IU" },
            { label: "Sodium", value: food_info[2]?.serving[index].sodium, unit: "mg" },
            { label: "Calcium", value: food_info[2]?.serving[index].calcium, unit: "mg" },
            { label: "Sodium", value: food_info[2]?.serving[index].sodium, unit: "mcg" },
            { label: "Potassium", value: food_info[2]?.serving[index].potassium, unit: "mg" }
        ]);

    }

    
    const handleAddItem = (index) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: {
                calories: { value: food_info[2]?.serving[index].calories * quantity, unit: "kCal" },
                protein: { value: food_info[2]?.serving[index].protein * quantity, unit: "g" },
                fat: { value: food_info[2]?.serving[index].fat * quantity, unit: "g" },
                carbohydrate: { value: food_info[2]?.serving[index].carbohydrate * quantity, unit: "g" },
                saturated_fat: { value: food_info[2]?.serving[index].saturated_fat * quantity, unit: "g" },
                unsaturated_fat: { value: food_info[2]?.serving[index].unsaturated_fat * quantity, unit: "g" },
                trans_fat: { value: food_info[2]?.serving[index].trans_fat * quantity, unit: "g" },
                sugar: { value: food_info[2]?.serving[index].sugar * quantity, unit: "g" },
                fiber: { value: food_info[2]?.serving[index].fiber * quantity, unit: "g" },
                vitamin_c: { value: food_info[2]?.serving[index].vitamin_c * quantity, unit: "mg" },
                iron: { value: food_info[2]?.serving[index].iron * quantity, unit: "mg" },
                vitamin_a: { value: food_info[2]?.serving[index].vitamin_a * quantity, unit: "IU" },
                sodium: { value: food_info[2]?.serving[index].sodium * quantity, unit: "mg" },
                calcium: { value: food_info[2]?.serving[index].calcium * quantity, unit: "mg" },
                potassium: { value: food_info[2]?.serving[index].potassium * quantity, unit: "mg" },
            }
        })
        
        console.log(state)
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.contentContainer}>
                    {/* General Info Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>General Information</Text>
                        <View style={styles.card}>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>{food_info[0]} ({(food_info[1] != null ? food_info[1] : "Generic")})</Text>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Amount</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Enter amount"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                    onChangeText={ (the_amount) =>{
                                        if(the_amount === ''){
                                           setQuantity(1); 
                                        }
                                        else{
                                            setQuantity(the_amount)
                                        }
                                        }
                                    }


                                />
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Serving</Text>
                                <Dropdown
                                    style={[styles.input, isFocus && { borderColor: 'blue' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    inputSearchStyle={styles.inputSearchStyle}
                                    iconStyle={styles.iconStyle}
                                    data={servingOptions}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="amount"
                                    placeholder={!isFocus ? 'Select item' : '...'}
                                    value={serving}
                                    onFocus={() => setIsFocus(true)}
                                    onBlur={() => setIsFocus(false)}
                                    onChange={(item)=> {
                                        index = food_info[2].serving.findIndex(
                                            (serving) => serving.serving_description === item.label
                                        )
                                    
                                        handleServingChange(index);

                                        setServing(item.amount);
                                        setIsFocus(false);
                                    }}/>
                            </View>
                        </View>
                    </View>

                    {/* Macros Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Macros</Text>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Energy Summary</Text>
                            <View style={styles.chartContainer}>
                                <View style={styles.legendContainer}>
                                    <Text style={[styles.legendText, { color: '#fbd203' }]}>Protein ({quantity * (Math.trunc(macros[0].value) !== -1 ? Math.trunc(macros[0].value) : protein)}g) - {protein_percentage}%</Text>
                                    <Text style={[styles.legendText, { color: '#ffb300' }]}>Fat ({quantity * (Math.trunc(macros[1].value) !== -1 ? Math.trunc(macros[1].value) : fat)}g) - {fat_percentage}%</Text>
                                    <Text style={[styles.legendText, { color: '#ff9100' }]}>Net Carbs ({quantity * (Math.trunc(macros[2].value) !== -1 ? Math.trunc(macros[2].value) : net_carb)}g) - {net_carb_percentage}%</Text>
                                </View>
                                
                                <View style={styles.pieContainer}>

                                    <PieChart 
                                        widthAndHeight={widthAndHeight} 
                                        series={[
                                            { value: protein, color: "#fbd203" }, // Protein
                                            { value: fat, color: "#ffb300" }, // Fat
                                            { value: net_carb, color: "#ff9100" }, // Carbs
                                        ]} 
                                        cover={0.6}
                                    />
                                    <View style={styles.chartOverlay}>
                                        <Text style={styles.overlayText}>{quantity * totalCalories}</Text>
                                        <Text style={styles.overlaySubText}>kCal</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Nutrition Facts Card */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Nutrition Facts</Text>
                            <View style={styles.nutritionFactsContainer}>
                                {nutrition.map((item, index) => (
                                    item.value != null && //only output valid nutrition facts

                                    <View key={index} style={styles.nutritionRow}>
                                        <Text style={styles.nutritionLabel}>{item.label}</Text>
                                        <Text style={styles.nutritionValue}>{(item.value * quantity) + " " + item.unit} </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Add Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={ () => 
                    {
                        handleAddItem(index);
                        handleGoBack();
                    }
                }>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    scrollContentContainer: {
        flexGrow: 1,
        paddingBottom: 80,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 8,
    },
    label: {
        fontSize: 16,
        color: '#666',
        flex: 1,
    },
    input: {
        flex: 2,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fafafa',
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    legendContainer: {
        flex: 1,
        paddingRight: 16,
    },
    legendText: {
        fontSize: 14,
        marginVertical: 4,
        fontWeight: '500',
    },
    pieContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartOverlay: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    overlaySubText: {
        fontSize: 14,
        color: '#666',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    addButton: {
        backgroundColor: '#007aff',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    nutritionFactsContainer: {
        flexDirection: 'column',
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
    },
    nutritionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    nutritionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    nutritionValue: {
        fontSize: 16,
        color: '#666',
    },
    
});