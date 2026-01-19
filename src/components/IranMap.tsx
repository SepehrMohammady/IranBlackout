import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

import { useTheme } from '../theme';
import { Region, ConnectivityStatus } from '../types';

interface IranMapProps {
    regions: Region[];
    onRegionPress?: (region: Region) => void;
}

// Province path data from the SVG map (simplified selection)
const provinces: Record<string, { path: string; name: string }> = {
    'IR.TH': {
        path: 'M438.7,216.3L436.7,215.9L433,217.1L429.4,216.3L423.7,213.5L419.5,212.8L416,211.4L412.9,211L409.3,214.3L404.7,221.4L401.8,222.7L398.1,222.5L392.3,219L388.8,214.1L383.2,209.1L376.6,206.7L369.5,206.1L364.1,203.2L364.4,205.6L364.9,208.7L362.6,210.3L358.9,209.8L355.5,211.2L353.3,214.4L353.6,220.7L349.6,220.9L348.9,224.3L347,227.2L344.4,229L343.7,231.8L346.3,234.4L347.8,236.7L348.5,240.5L346.8,253.3L346.8,253.4L359.9,253.6L371.5,256.9L400.2,272.3L399.9,270L400.6,265.5L402.3,261.9L402.3,258.5L399.5,254.7L393.2,247.9L392.3,234.5L392.9,233.7L395.5,235L398.2,235.1L401.1,237.3L410.3,242.4L413.9,243.5L417.4,243.6L428.2,246.6L431.9,246.7L436.8,245L440.9,242.6L447,236L447.5,231L445.9,225.4L443.3,219.1L438.7,216.3Z',
        name: 'Tehran'
    },
    'IR.ES': {
        path: 'M564.7,301.3L560.8,299.5L452,302.8L449.6,302.4L429,296L425.8,295.5L413.4,296.3L408.7,295.6L399.1,290.8L384.3,294.8L380.7,294.6L371,295.8L367,297.7L365.3,301L365.7,311.8L367.1,314.2L368.5,314.9L368.5,318.2L365.9,328.8L365,330.9L362.4,331L359.6,331.9L354.8,335.8L336.5,340.9L329.9,345.2L326.6,348.3L325.9,350.5L326.7,355.9L322.5,368.2L316,370.1L313.8,373.3L314,379.8L312.1,381.3L308.7,382.6L307.2,385.7L307.3,386.2L310.4,391.7L313.1,393.1L317,392.8L321.9,394.6L324.2,397.2L323.5,398.7L322.9,402.8L331.2,397.9L334.4,398.3L339.3,396.8L342.4,398.4L345.6,400.7L348.6,401.1L354.4,400.6L359,397.3L366.8,396.7L371.3,394.6L373.4,396.2L374.9,400L376.2,400.3L378.9,404.3L379.2,408.3L380.4,412.6L387,417.1L389.8,419.6L395.8,423.7L398.9,428.1L400.6,433.8L399.6,436.7L397.9,438L400.8,443.1L401.2,444.8L397.9,446.8L398.1,449.7L400.1,455.9L406.4,470L406.9,474.3L406.8,476.2L407.6,479.8L411.2,486.5L417,491.9L424.1,496.6L425.2,497.6L428.7,497L429.9,496.6L428.7,491.6L428.3,486.8L430.8,477L430.9,471.4L431.5,467.6L429.6,464L426.6,461.9L420.9,459.4L419.4,456.8L419.4,455.2L424,456.3L427.4,455.8L434.9,449.7L440.7,446.2L442.5,447.8L443.7,452.9L446.1,454.8L456.8,457.1L460.2,457.1L475.3,452.5L475.4,452.5L472.1,444.5L471.4,440.7L471.7,439.3L471.5,432.7L472.2,425L472.1,421.5L468,404.7L468.1,402.8L469.7,401.6L472.9,400.6L479.8,395.4L484,393.7L487.4,393.6L502.5,396.9L548.5,380.1L552.9,377.3L554.9,374.2L556,370.9L556.8,366.8L557.3,357.6L559.3,354.6L563.4,352.1L566.9,351.7L569.2,349.9L572,343.1L572.5,339.2L565.3,301.9L564.7,301.3Z',
        name: 'Isfahan'
    },
    'IR.FA': {
        path: 'M475.3,452.5L460.2,457.1L456.8,457.1L446.1,454.8L443.7,452.9L442.5,447.8L440.7,446.2L434.9,449.7L427.4,455.8L424,456.3L419.4,455.2L419.4,456.8L420.9,459.4L426.6,461.9L429.6,464L431.5,467.6L430.9,471.4L430.8,477L428.3,486.8L428.7,491.6L429.9,496.6L428.7,497L425.2,497.6L427.6,504.4L426.8,508.8L422.2,510.8L417.1,509.5L412.8,506.9L407.1,504.2L403.2,503.3L402.6,504.1L404,508.7L407.8,518.4L408.1,521.2L407.5,523.3L396.1,530.7L394.1,531L386.3,530.6L381.8,531.7L381.8,531.9L382.2,534.7L384,538.6L386.6,541L390.3,546.9L393.1,547.9L403.5,548.7L410.1,550.8L413.7,554.4L417,560.3L421.1,565.6L424.5,568.8L428.4,570.2L433,574.1L459.3,614.7L461.1,619.6L470.4,639.6L471.9,641.6L475.7,643.5L479.8,647.7L488,662.5L495.1,670.4L501.8,676.3L512.1,683.3L513.6,685.9L517.5,689.3L528.1,690.3L529.9,691L535.9,694.9L540.4,694L555.1,696.6L559.7,693.9L560.7,691.8L560.7,682.2L562.4,679.5L567.1,677.8L579.4,676.6L584.6,677.8L586.8,676.8L591,675.7L603.7,677.6L609.3,675.7L611.7,673L612.6,668.2L614,665.1L620,661.6L624.1,660.4L626.8,660.6L629.8,657.8L629.6,654.7L626.9,650.9L622.5,647.5L622,643.5L623.1,634.5L622.9,628.4L621.2,624.9L605.2,610.9L604.6,608.3L606,607.1L605.7,605.6L601.9,597.2L589,573.2L586.2,572L575.3,571L570.5,566.6L569.7,564.5L564.7,556.5L562.8,552.2L562.7,551.1L552.5,546.2L544.5,540.6L542.7,537.4L539.3,525.4L536.7,521.7L527.9,512.5L518.1,498.5L503,470.8L495.9,463.5L487.9,457.1L475.4,452.5L475.3,452.5Z',
        name: 'Fars'
    },
    'IR.KV': {
        path: 'M633.6,103.6L628.9,106.9L627.5,108.6L627.6,115L629.6,116.2L650.1,117.2L653.7,122.5L658.6,126.2L660.3,128.7L661.1,131L659.6,134.2L659.5,138L658.3,140.2L657.3,148.1L655.9,150.4L656.5,152.3L661.7,156.8L663.2,154.9L667.7,159.5L665.6,162.3L668.2,165.7L668.9,167.5L668.3,171.8L667,173.4L663.7,174.3L650.7,172.3L617.3,155.9L610,155.5L600.9,164.3L599,167.7L599.9,172.3L600,173.8L600.9,173.5L604.4,174.7L606.4,179.1L606.2,184.3L605,187.8L605.6,193.9L608.5,204.3L611.3,211.1L613.1,214.2L625.7,223L629.3,226.4L629.4,230.3L624,243.9L623,248.4L621.8,249.5L612.8,253.1L608.2,256.2L603.4,261.6L597.7,270.6L615.5,265.8L632,257.2L642.9,254.2L648.3,255.6L663.6,265.8L665.8,269.3L665.9,272.8L662.3,277.1L646.6,289.9L644.5,295.6L642,312.9L643.3,322.2L649.1,338.1L651.9,341.5L661.2,342.6L672.4,339.8L674.9,342.4L677.3,345.9L685,369.1L689.3,375.9L698.1,380.4L702.4,382.8L707.2,388.6L708.6,389.5L709.5,388.1L710.8,384.7L711.2,378.2L715.8,368.6L728.5,359L730.1,356.9L731.7,353.2L732.6,349.1L724.7,344L722.1,340.4L720.6,339.1L719.9,336.8L720.6,330.8L719.5,326.2L719.4,318.5L716.9,312.6L719.2,311.6L726.6,312.6L731.6,314L733.7,311.6L746.9,309.6L750.7,307.2L755.2,305.4L758,307.5L763.9,314.8L770.4,317L798.9,316.9L802.4,316.3L802.2,315.5L801.9,313.1L805.1,306.9L807,303.8L818.2,303.1L808.6,292.9L807.7,291.1L813,289.2L815,286L817.6,284.9L816.9,280.8L820.7,275.7L820.5,271.9L819.8,269.8L821.2,259.8L818.2,255.2L818.4,254.2L817.4,250L820.7,248.7L820.2,243.1L820.9,241.8L822.6,234.9L818.5,228L818.7,225.2L816.8,216.6L813.2,212.3L810.3,211.3L811.5,209.9L812.8,203.1L812.2,200.8L809.9,196.3L809.2,193.8L806.5,189.7L806.2,182.5L805.5,181L805.9,178.1L804.1,174.1L799.8,173.5L766.7,174.1L765,173.3L760.4,166.7L754.3,160.9L747.4,152.3L741.7,151L736.3,147.5L728.8,145.4L726.7,146.4L724.3,142.7L720.7,142.4L719.9,140.3L715.2,136.7L712.4,130.9L711.9,126.9L709.3,124.1L708.2,123.9L704.9,124.9L698,120.7L690.9,117.2L684.1,116.2L683.7,116.9L676.3,116.9L673.6,115L665.6,118.6L662.9,117.3L659.3,116.8L655.3,110.5L648.6,108.8L640.8,105.4L633.8,103.6L633.6,103.6Z',
        name: 'Razavi Khorasan'
    },
};

const IranMap: React.FC<IranMapProps> = ({ regions, onRegionPress }) => {
    const { colors, isDark } = useTheme();
    const screenWidth = Dimensions.get('window').width - 64;
    const mapHeight = screenWidth * 0.8;

    const getStatusColor = (status: ConnectivityStatus): string => {
        switch (status) {
            case 'online': return colors.online;
            case 'limited': return colors.limited;
            case 'offline': return colors.offline;
            default: return colors.unknown;
        }
    };

    // Create a map of region statuses for quick lookup
    const regionStatusMap: Record<string, ConnectivityStatus> = {};
    regions.forEach(region => {
        // Map region id to province code (simplified mapping)
        const codeMap: Record<string, string> = {
            'tehran': 'IR.TH',
            'isfahan': 'IR.ES',
            'shiraz': 'IR.FA',
            'mashhad': 'IR.KV',
        };
        const code = codeMap[region.id];
        if (code) {
            regionStatusMap[code] = region.status;
        }
    });

    return (
        <View style={[styles.container, { width: screenWidth, height: mapHeight }]}>
            <Svg
                width={screenWidth}
                height={mapHeight}
                viewBox="0 0 1000 812"
                preserveAspectRatio="xMidYMid meet"
            >
                <G>
                    {Object.entries(provinces).map(([id, { path, name }]) => {
                        const status = regionStatusMap[id] || 'unknown';
                        return (
                            <Path
                                key={id}
                                d={path}
                                fill={getStatusColor(status)}
                                stroke={isDark ? '#1E293B' : '#FFFFFF'}
                                strokeWidth={2}
                                opacity={0.9}
                            />
                        );
                    })}
                </G>
            </Svg>

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.online }]} />
                    <Text style={[styles.legendText, { color: colors.textSecondary }]}>Online</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.limited }]} />
                    <Text style={[styles.legendText, { color: colors.textSecondary }]}>Limited</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.offline }]} />
                    <Text style={[styles.legendText, { color: colors.textSecondary }]}>Offline</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.unknown }]} />
                    <Text style={[styles.legendText, { color: colors.textSecondary }]}>Unknown</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendText: {
        fontSize: 12,
    },
});

export default IranMap;
