import { View, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { MotiView } from "moti";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function FilterModal({ visible, onClose, children }: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="auto"
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)" }} />
        </TouchableOpacity>

        {/* Modal content */}
        <MotiView
          from={{ translateY: 300 }}
          animate={{ translateY: 0 }}
          exit={{ translateY: 300 }}
          transition={{ type: "timing", duration: 300 }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            minHeight: 300,
          }}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            {children}
          </TouchableOpacity>
        </MotiView>
      </MotiView>
    </Modal>
  );
}