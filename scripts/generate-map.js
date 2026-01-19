const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'assets', 'Map.svg');
const outputPath = path.join(__dirname, '..', 'src', 'components', 'IranMap.tsx');

const svg = fs.readFileSync(svgPath, 'utf8');

// Extract all provinces
const pathRegex = /<path[^>]*d="([^"]+)"[^>]*data-id="([^"]+)"[^>]*data-name="([^"]+)"/g;
const provinces = {};
let match;
while ((match = pathRegex.exec(svg)) !== null) {
    provinces[match[2]] = { path: match[1], name: match[3] };
}

console.log(`Found ${Object.keys(provinces).length} provinces`);

const component = `import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { useTheme } from '../theme';
import { Region, ConnectivityStatus } from '../types';

interface IranMapProps {
  regions: Region[];
  onRegionPress?: (region: Region) => void;
}

const provinces: Record<string, { path: string; name: string }> = ${JSON.stringify(provinces, null, 2)};

const IranMap: React.FC<IranMapProps> = ({ regions }) => {
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

  const regionStatusMap: Record<string, ConnectivityStatus> = {};
  regions.forEach(region => {
    const codeMap: Record<string, string> = {
      'tehran': 'IR.TH', 'isfahan': 'IR.ES', 'shiraz': 'IR.FA', 'mashhad': 'IR.KV',
      'tabriz': 'IR.EA', 'karaj': 'IR.AL', 'qom': 'IR.QM', 'ahvaz': 'IR.KZ',
      'kerman': 'IR.KE', 'urmia': 'IR.WA'
    };
    const code = codeMap[region.id];
    if (code) regionStatusMap[code] = region.status;
  });

  return (
    <View style={[styles.container, { width: screenWidth, height: mapHeight }]}>
      <Svg width={screenWidth} height={mapHeight} viewBox="0 0 1000 812" preserveAspectRatio="xMidYMid meet">
        <G>
          {Object.entries(provinces).map(([id, { path }]) => {
            const status = regionStatusMap[id] || 'unknown';
            return (
              <Path key={id} d={path} fill={getStatusColor(status)}
                stroke={isDark ? '#1E293B' : '#FFFFFF'} strokeWidth={1.5} opacity={0.9} />
            );
          })}
        </G>
      </Svg>
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
  container: { alignItems: 'center', justifyContent: 'center' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10 },
});

export default IranMap;
`;

fs.writeFileSync(outputPath, component);
console.log('IranMap.tsx generated successfully!');
