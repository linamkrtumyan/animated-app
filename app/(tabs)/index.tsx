import { StyleSheet, View } from "react-native";
import AnimatedPagination from "@/components/pagination";
import { useState } from "react";

export default function HomeScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <View style={styles.container}>
      <AnimatedPagination
        total={4}
        selectedIndex={selectedIndex}
        onIndexChange={(index) => setSelectedIndex(index)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
