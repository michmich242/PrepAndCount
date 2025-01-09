import {
    View,
    Text,
} from 'react-native';
import { callSearch } from "../../callAPI";
import { DMContext } from "../../app/_layout";
import { StyleSheet } from 'react-native';
import { useContext } from 'react';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function MacrosScreen() {
    const [darkModeEnabled, setDarkModeEnabled] = useContext(DMContext);
    const screenWidth = Dimensions.get('window').width;

    const chartData = [
        { name: 'Protein', population: 30, color: 'blue', legendFontColor: darkModeEnabled ? "#fff" : "#333", legendFontSize: 12 },
        { name: 'Carbs', population: 40, color: 'red', legendFontColor: darkModeEnabled ? "#fff" : "#333", legendFontSize: 12 },
        { name: 'Fats', population: 30, color: 'yellow', legendFontColor: darkModeEnabled ? "#fff" : "#333", legendFontSize: 12 },
    ];

    return (
        <View style={{ flexDirection: 'column' }}>
            <Text style={[styles.text, styles.textContainer]}>Name</Text>
            <Text style={[styles.text, styles.textContainer]}>Amount</Text>
            <Text style={[styles.text, styles.textContainer]}>Serving</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {/* Legend */}
                <View style={styles.legendContainer}>
                    {chartData.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                            <Text style={[styles.legendText, { color: item.legendFontColor }]}>{item.name}</Text>
                        </View>
                    ))}
                </View>

                {/* Pie Chart */}
                <View style={styles.macrosSection}>
                    <Text style={[styles.sectionHeader, { color: darkModeEnabled ? "#fff" : "#333" }]}>Macros</Text>
                    <PieChart
                        data={chartData}
                        width={screenWidth * 0.6} // Reduced width to make room for the legend
                        height={150}
                        chartConfig={{
                            backgroundColor: 'transparent',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            strokeWidth: 2,
                            barPercentage: 0.5,
                        }}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    text: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontSize: 18,
        margin: 10,
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    macrosSection: {
        flex: 1,
    },
    legendContainer: {
        marginRight: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    colorBox: {
        width: 15,
        height: 15,
        marginRight: 5,
    },
    legendText: {
        fontSize: 14,
    },
});
