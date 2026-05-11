import * as React from 'react';
import { View, TextInput, Image, TextInputProps, Platform, Modal, Pressable, Text, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface AiDateInputProps extends TextInputProps {
  iconSource: any;
  containerClassName?: string;
  inputClassName?: string;
}

const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

export const AiDateInput: React.FC<AiDateInputProps> = ({
  iconSource,
  containerClassName = "relative",
  inputClassName = "w-full h-[56px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.3)] rounded-[20px] px-5 text-white text-[16px] outline-none transition-colors pr-16",
  ...props
}) => {
  const [focused, setFocused] = React.useState(false);
  const [showPicker, setShowPicker] = React.useState(false);
  const [mode, setMode] = React.useState<'date' | 'year' | 'month'>('date');
  
  // Base date for the calendar view
  const [viewDate, setViewDate] = React.useState(new Date());

  // Parse current value (mm/dd/yyyy)
  React.useEffect(() => {
    if (props.value && typeof props.value === 'string') {
      const match = props.value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (match) {
        setViewDate(new Date(Number(match[3]), Number(match[1]) - 1, Number(match[2])));
      }
    }
  }, [props.value, showPicker]);

  const webFocusStyle = Platform.OS === 'web' ? { 
    outlineStyle: 'none' as any,
    borderColor: focused ? 'rgba(155,254,3,0.5)' : 'rgba(255,255,255,0.3)'
  } : {};

  // Calendar rendering logic
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleSelectDay = (day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const yyyy = year;
    props.onChangeText?.(`${mm}/${dd}/${yyyy}`);
    handleClose();
  };

  const handleClose = () => {
    setShowPicker(false);
    setTimeout(() => setMode('date'), 300);
  };

  const renderYearPicker = () => {
    const currentY = new Date().getFullYear();
    const years = Array.from({ length: 120 }, (_, i) => currentY - i); // From current year down to 120 years ago
    return (
      <View className="flex-1 w-full">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
          <View className="flex-row flex-wrap justify-between">
            {years.map(y => (
              <Pressable
                key={y}
                onPress={() => {
                  setViewDate(new Date(y, month, 1));
                  setMode('date');
                }}
                className={`w-[30%] h-12 items-center justify-center rounded-xl mb-3 ${
                  y === year ? 'bg-[rgba(155,254,3,0.9)] shadow-[0_0_10px_rgba(155,254,3,0.5)]' : 'active:bg-white/10 hover:bg-white/5 bg-white/5'
                }`}
              >
                <Text className={`text-[16px] ${y === year ? 'text-black font-bold' : 'text-white'}`}>{y}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderMonthPicker = () => {
    return (
      <View className="flex-1 flex-row flex-wrap justify-between items-start pt-1">
        {MONTHS.map((mName, i) => (
          <Pressable
            key={i}
            onPress={() => {
              setViewDate(new Date(year, i, 1));
              setMode('date');
            }}
            className={`w-[30%] h-14 items-center justify-center rounded-xl mb-4 ${
              i === month ? 'bg-[rgba(155,254,3,0.9)] shadow-[0_0_10px_rgba(155,254,3,0.5)]' : 'active:bg-white/10 hover:bg-white/5 bg-white/5'
            }`}
          >
            <Text className={`text-[16px] ${i === month ? 'text-black font-bold' : 'text-white'}`}>{mName}</Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderCalendar = () => {
    const days = [];
    const totalSlots = 42; // 6 weeks * 7 days to ensure fixed height and no shaking
    
    // Check if current month contains the selected date
    let selectedDay = -1;
    if (props.value && typeof props.value === 'string') {
      const match = props.value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (match && Number(match[3]) === year && Number(match[1]) - 1 === month) {
        selectedDay = Number(match[2]);
      }
    }

    // Generate fixed 42 slots grid
    for (let i = 0; i < totalSlots; i++) {
      if (i < firstDay) {
        // Empty slots before first day
        days.push(<View key={`empty-start-${i}`} className="w-[14%] aspect-square" />);
      } else if (i < firstDay + daysInMonth) {
        // Actual days
        const currentDay = i - firstDay + 1;
        const isSelected = currentDay === selectedDay;
        days.push(
          <Pressable
            key={`day-${currentDay}`}
            onPress={() => handleSelectDay(currentDay)}
            className={`w-[14%] aspect-square items-center justify-center rounded-full transition-colors ${
              isSelected ? 'bg-[rgba(155,254,3,0.9)] shadow-[0_0_10px_rgba(155,254,3,0.5)]' : 'active:bg-white/10 hover:bg-white/5'
            }`}
          >
            <Text className={`text-[17px] ${isSelected ? 'text-[#0a0a0a] font-bold' : 'text-white font-medium'}`}>
              {currentDay}
            </Text>
          </Pressable>
        );
      } else {
        // Empty slots after last day
        days.push(<View key={`empty-end-${i}`} className="w-[14%] aspect-square" />);
      }
    }

    return (
      <Modal transparent visible={showPicker} animationType="fade" onRequestClose={handleClose}>
        <Pressable 
          className="flex-1 bg-black/70 items-center justify-center p-5" 
          onPress={handleClose}
        >
          <Pressable 
            className="w-full max-w-[340px] bg-[#1a1a1a] rounded-[24px] p-5 border border-[rgba(155,254,3,0.2)] shadow-[0_0_40px_rgba(155,254,3,0.15)]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4 px-1">
              <Pressable 
                onPress={handlePrevMonth} 
                className="w-10 h-10 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
              >
                <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="m15 18-6-6 6-6"/>
                </Svg>
              </Pressable>
              
              <View className="flex-row items-center gap-2">
                <Pressable onPress={() => setMode(mode === 'year' ? 'date' : 'year')} className="px-3 py-2 rounded-xl bg-white/5 active:bg-white/10 flex-row items-center">
                  <Text className="text-white text-[16px] font-bold">{year}年</Text>
                </Pressable>
                <Pressable onPress={() => setMode(mode === 'month' ? 'date' : 'month')} className="px-3 py-2 rounded-xl bg-white/5 active:bg-white/10 flex-row items-center">
                  <Text className="text-white text-[16px] font-bold">{MONTHS[month]}</Text>
                </Pressable>
              </View>

              <Pressable 
                onPress={handleNextMonth} 
                className="w-10 h-10 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
              >
                <Svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <Path d="m9 18 6-6-6-6"/>
                </Svg>
              </Pressable>
            </View>

            {/* Fixed Height Container for Content to prevent shaking */}
            <View style={{ height: 280, width: '100%' }}>
              {mode === 'year' && renderYearPicker()}
              {mode === 'month' && renderMonthPicker()}
              
              {mode === 'date' && (
                <View className="flex-1">
                  {/* Weekdays */}
                  <View className="flex-row items-center mb-2">
                    {WEEKDAYS.map(wd => (
                      <View key={wd} className="w-[14%] items-center">
                        <Text className="text-white/40 text-[14px] font-medium">{wd}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Days Grid - Fixed exactly 42 slots to prevent height shaking */}
                  <View className="flex-row flex-wrap">
                    {days}
                  </View>
                </View>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };

  return (
    <View className={containerClassName}>
      <Pressable 
        onPress={() => { if (props.editable !== false) setShowPicker(true); }}
        className="w-full"
      >
        <View pointerEvents="none">
          <TextInput
            {...props}
            value={props.value}
            editable={false} // Disable native keyboard
            placeholderTextColor="rgba(255,255,255,0.4)"
            className={inputClassName}
            style={[
              webFocusStyle,
              { fontFamily: "'Noto Sans SC', sans-serif" }
            ]}
          />
        </View>
      </Pressable>
      <View className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none z-0">
        <Image 
          source={iconSource} 
          style={{ width: 26, height: 28 }} 
          resizeMode="contain" 
        />
      </View>
      {renderCalendar()}
    </View>
  );
};
