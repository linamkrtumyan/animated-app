import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  PressableProps,
} from "react-native";
import Animated, {
  AnimatedProps,
  FadeInDown,
  FadeInLeft,
  FadeOutLeft,
  FadeOutUp,
  interpolateColor,
  LinearTransition,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const _spacing = 8;
const _buttonHeight = 42;
const _layoutTransition = LinearTransition.springify()
  .damping(80)
  .stiffness(200);
const _dotContainer = 24;
const _dotSize = _dotContainer / 3;
const _activeDot = "#fff";
const _inactiveDot = "#aaa";

function Button({ children, style, ...rest }: AnimatedProps<PressableProps>) {
  return (
    <AnimatedPressable
      style={[styles.button, style]}
      entering={FadeInLeft.springify().damping(80).stiffness(200)}
      exiting={FadeOutLeft.springify().damping(80).stiffness(200)}
      layout={_layoutTransition}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}

function Dot({
  index,
  animation,
}: {
  index: number;
  animation: SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        animation.value,
        [index - 1, index, index + 1],
        [_inactiveDot, _activeDot, _activeDot]
      ),
    };
  });

  return (
    <View
      style={{
        height: _dotContainer,
        width: _dotContainer,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            width: _dotSize,
            height: _dotSize,
            borderRadius: _dotSize / 2,
          },
        ]}
      />
    </View>
  );
}

function PaginationIndicator({
  animation,
}: {
  animation: SharedValue<number>;
}) {
  const styles = useAnimatedStyle(() => {
    return {
      width: _dotContainer + _dotContainer * animation.value,
    };
  });
  return (
    <Animated.View
      style={[
        {
          backgroundColor: "#29BE56",
          height: _dotContainer,
          width: _dotContainer,
          borderRadius: _dotContainer,
          position: "absolute",
          left: 0,
          top: 0,
        },
        styles,
      ]}
    />
  );
}

function Pagination({
  total,
  selectedIndex,
}: {
  total: number;
  selectedIndex: number;
}) {
  const animation: SharedValue<number> = useDerivedValue(() => {
    return withSpring(selectedIndex, {
      damping: 80,
      stiffness: 200,
    });
  });

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <PaginationIndicator animation={animation} />
        {[...Array(total).keys()].map((i) => (
          <Dot key={`dot-${i}`} index={i} animation={animation} />
        ))}
      </View>
    </View>
  );
}

export default function AnimatedPagination({
  total,
  selectedIndex,
  onIndexChange,
}: {
  total: number;
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}) {
  return (
    <View style={styles.container}>
      <Pagination total={total} selectedIndex={selectedIndex} />
      <View style={styles.buttonRow}>
        {/* Back Button */}
        {selectedIndex > 0 && (
          <Button
            onPress={() => onIndexChange(selectedIndex - 1)}
            style={styles.backButton}
          >
            <Text style={styles.buttonText}>Back</Text>
          </Button>
        )}

        <Button
          onPress={() => {
            if (selectedIndex >= total - 1) return;
            onIndexChange(selectedIndex + 1);
          }}
          style={[
            styles.continueButton,
            selectedIndex === total && styles.finishButton,
          ]}
        >
          {selectedIndex === total - 1 ? (
            <Animated.Text
              key="finish"
              style={styles.buttonText}
              entering={FadeInDown.springify().damping(80).stiffness(200)}
              exiting={FadeOutUp.springify().damping(80).stiffness(200)}
              layout={_layoutTransition}
            >
              Finish
            </Animated.Text>
          ) : (
            <Animated.Text
              key="continue"
              style={styles.buttonText}
              entering={FadeInDown.springify().damping(80).stiffness(200)}
              exiting={FadeOutUp.springify().damping(80).stiffness(200)}
              layout={_layoutTransition}
            >
              Continue
            </Animated.Text>
          )}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: _spacing * 2,
    gap: _spacing * 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: _spacing * 2,
  },
  buttonRow: {
    flexDirection: "row",
    gap: _spacing,
  },
  button: {
    height: _buttonHeight,
    borderRadius: _buttonHeight / 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: _spacing * 2,
  },
  backButton: {
    backgroundColor: "#ddd",
  },
  continueButton: {
    backgroundColor: "#036bf7",
    flex: 1,
  },
  finishButton: {
    backgroundColor: "#28a745",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
