import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { callSearch } from "../../callAPI";
import { DMContext } from "../../app/_layout";
import { StyleSheet } from 'react-native';
import { useContext } from 'react';
import PieChart from 'react-native-pie-chart'
import { Dimensions } from 'react-native';
import { useNavigation } from 'expo-router';

export default function MacrosScreen() {
    const [darkModeEnabled] = useContext(DMContext);
    const screenWidth = Dimensions.get('window').width;
    const navigation = useNavigation();
    
    const handleGoBack = () => {
        navigation.goBack();
    };

    const series = [
        { value: 430, color: '#fbd203' },
        { value: 321, color: '#ffb300' },
        { value: 185, color: '#ff9100' },
    ];

    const widthAndHeight = 125;
    const totalCalories = 100;

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
                                <Text style={styles.label}>Name</Text>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Amount</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Enter amount"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Serving</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Enter serving"
                                    placeholderTextColor="#999"
                                />
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
                                    <Text style={[styles.legendText, { color: '#fbd203' }]}>Protein - 60%</Text>
                                    <Text style={[styles.legendText, { color: '#ffb300' }]}>Fat - 30%</Text>
                                    <Text style={[styles.legendText, { color: '#ff9100' }]}>Net Carbs - 10%</Text>
                                </View>
                                
                                <View style={styles.pieContainer}>
                                    <PieChart 
                                        widthAndHeight={widthAndHeight} 
                                        series={series} 
                                        cover={0.6}
                                    />
                                    <View style={styles.chartOverlay}>
                                        <Text style={styles.overlayText}>{totalCalories}</Text>
                                        <Text style={styles.overlaySubText}>kCal</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Nutrition Facts Card */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Nutrition Facts</Text>
                            {/* Add nutrition facts content here */}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Add Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={handleGoBack}>
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
});