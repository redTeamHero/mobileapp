// app/(tabs)/index.tsx
// Everyday Winners • Credit Path (custom theme)
// Works on iOS/Android/Web (Expo). Beginner-friendly inline comments.

import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

// ──────────────────────────────────────────────────────────────────────────────
// THEME — tweak these colors to rebrand fast
// ──────────────────────────────────────────────────────────────────────────────
const THEME = {
  brand: {
    navy: "#0b1220",
    teal: "#15c2b8",
    tealDark: "#0aa19a",
    gold: "#ffcc49",
    slate: "#0f172a",
    glass: "rgba(255,255,255,0.08)",
    border: "rgba(255,255,255,0.1)",
  },
  text: {
    primary: "#e9eef7",
    secondary: "#b8c2d9",
    muted: "#7b87a2",
  },
};

// Gradient per lesson type
const gradientByType = (type: string) => {
  switch (type) {
    case "core":      return [THEME.brand.teal, THEME.brand.tealDark];
    case "reading":   return ["#8A5CF6", "#6B46D6"]; // purple family
    case "listening": return ["#F97316", "#EA580C"]; // orange family
    case "video":     return ["#F43F5E", "#E11D48"]; // rose family
    default:          return [THEME.brand.teal, THEME.brand.tealDark];
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// Fake “economy” (wire to your backend later)
// ──────────────────────────────────────────────────────────────────────────────
const initialWallet = { coins: 10, flames: 0, gems: 189, energy: 25 };

// Lesson seed data (pretend DB rows)
const SEED_LESSONS = [
  { id: "S1P1",  title: "FCRA 101 Part 1 – Name the Parties",           type: "reading", unlocked: true,  stars: 0, total: 3, section: 1 },
  { id: "S1P2",  title: "FCRA 101 Part 2 – Purpose and Scope",          type: "reading", unlocked: false, stars: 0, total: 3, section: 1 },
  { id: "S1P3",  title: "FCRA 101 Part 3 – Permissible Purpose",        type: "reading", unlocked: false, stars: 0, total: 3, section: 1 },
  { id: "S1P4",  title: "FCRA 101 Part 4 – Consumer Rights",            type: "reading", unlocked: false, stars: 0, total: 3, section: 1 },
  { id: "S1P5",  title: "FCRA 101 Part 5 – Furnisher Duties",           type: "reading", unlocked: false, stars: 0, total: 3, section: 1 },
  { id: "S1P6",  title: "FCRA 101 Part 6 – CRA Duties",                 type: "reading", unlocked: false, stars: 0, total: 3, section: 1 },
  { id: "S1P7",  title: "FCRA 101 Part 7 – Dispute Process",            type: "reading", unlocked: false, stars: 0, total: 3, section: 1 },
  { id: "S1P8",  title: "FCRA 101 Part 8 – Enforcement",                type: "reading", unlocked: false, stars: 0, total: 3, section: 1 },
  { id: "S1P9",  title: "FCRA 101 Part 9 – Penalties",                  type: "reading", unlocked: false, stars: 0, total: 3, section: 1 },
  { id: "S1P10", title: "FCRA 101 Part 10 – Practical Application",     type: "reading", unlocked: false, stars: 0, total: 3, section: 1 },
  { id: "S1Quiz", title: "FCRA 101 Quiz",                               type: "core",    unlocked: false, stars: 0, total: 3, section: 1 },
  { id: "S1Workbook", title: "FCRA 101 Workbook",                       type: "core",    unlocked: false, stars: 0, total: 3, section: 1 },
  { id: "S2P1", title: "FDCPA 101 Part 1 – Overview",                   type: "reading", unlocked: false, stars: 0, total: 3, section: 2 },
  { id: "S2P2", title: "FDCPA 101 Part 2 – Communication Rules",        type: "reading", unlocked: false, stars: 0, total: 3, section: 2 },
  { id: "S2Quiz", title: "FDCPA 101 Quiz",                              type: "core",    unlocked: false, stars: 0, total: 3, section: 2 },
  { id: "S2Workbook", title: "FDCPA 101 Workbook",                      type: "core",    unlocked: false, stars: 0, total: 3, section: 2 },
];

// Leaderboard seed data (pretend weekly XP standings)
const SEED_LEADERBOARD = [
  { name: "Ryan", avatar: "🧔", xp: 862 },
  { name: "Beatriz", avatar: "👩", xp: 480 },
  { name: "Diego", avatar: "👨‍🦱", xp: 266 },
  { name: "Larissa Holanda", avatar: "👩‍🦰", xp: 239 },
  { name: "Mel", avatar: "👩‍🦱", xp: 230 },
];

const { width } = Dimensions.get("window");

// Small reusable stat badge (coins/gems/energy)
const StatChip = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.statChip}>
    <Text style={styles.statText}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

// Choose an emoji by lesson type (fast + portable)
const emojiByType = (type: string) =>
  type === "core"      ? "⭐" :
  type === "reading"   ? "📖" :
  type === "listening" ? "🎧" :
  type === "video"     ? "🎥" : "⭐";

// ──────────────────────────────────────────────────────────────────────────────
// One path item: **Tile** with gradient (our new look)
// ──────────────────────────────────────────────────────────────────────────────
function LessonTile({
  item,
  index,
  onPress,
}: {
  item: any;
  index: number;
  onPress: (l: any) => void;
}) {
  // Zig-zag layout (left/right)
  const isLeft = index % 2 === 0;
  const TILE_W = 220;
  const horizontal = isLeft ? 16 : width - 16 - TILE_W;
  const locked = !item.unlocked;
  const grad = gradientByType(item.type);

  return (
    <View style={[styles.tileRow, { paddingTop: index === 0 ? 8 : 24 }]}>
      <TouchableOpacity
        onPress={() => !locked && onPress(item)}
        activeOpacity={locked ? 1 : 0.85}
        style={[styles.tileWrap, { left: horizontal, width: TILE_W, opacity: locked ? 0.7 : 1 }]}
      >
        <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.tile}>
          <View style={styles.tileHeader}>
            <Text style={styles.tileEmoji}>{locked ? "🔒" : emojiByType(item.type)}</Text>
            <Text style={styles.tileType}>{item.type.toUpperCase()}</Text>
          </View>

          <Text numberOfLines={2} style={styles.tileTitle}>{item.title}</Text>

          <View style={styles.starsRow}>
            {Array.from({ length: item.total }).map((_, i) => (
              <Text key={i} style={styles.starGlyph}>{i < item.stars ? "★" : "☆"}</Text>
            ))}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
function PathScreen({ lessons, openLesson, wallet, openLeaderboard }: any) {
  // Overall progress (stars earned / stars available)
  const progress = useMemo(() => {
    const earned = lessons.reduce((s: number, l: any) => s + l.stars, 0);
    const max    = lessons.reduce((s: number, l: any) => s + l.total, 0);
    return { earned, max, pct: Math.round((earned / max) * 100) || 0 };
  }, [lessons]);

  const section1 = useMemo(() => lessons.filter((l: any) => l.section === 1), [lessons]);
  const section2 = useMemo(() => lessons.filter((l: any) => l.section === 2), [lessons]);

  return (
    <SafeAreaView style={styles.screen}>
      {/* sets page title / header on web */}
      <Stack.Screen options={{ title: "Everyday Winners · Credit Path" }} />
      <StatusBar barStyle={Platform.OS === "ios" ? "light-content" : "light-content"} />

      {/* Top bar with economy + section header */}
      <View style={styles.topBar}>
        <View style={styles.statsRow}>
          <StatChip label="🪙" value={wallet.coins} />
          <StatChip label="🔥" value={wallet.flames} />
          <StatChip label="💎" value={wallet.gems} />
          <StatChip label="⚡" value={wallet.energy} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionKicker}>EVERYDAY WINNERS • CREDIT ACADEMY</Text>
          <Text style={styles.sectionSubtitle}>Basics of Credit</Text>
          <Text style={styles.sectionProgress}>
            Progress: {progress.earned}/{progress.max} ({progress.pct}%)
          </Text>
        </View>
      </View>

      {/* Scrollable Path */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.sectionLabel}>Section 1 – FCRA Basics</Text>
        {section1.map((item: any, idx: number) => (
          <LessonTile key={item.id} item={item} index={idx} onPress={openLesson} />
        ))}

        <Text style={styles.sectionLabel}>Section 2 – FDCPA Basics</Text>
        {section2.map((item: any, idx: number) => (
          <LessonTile key={item.id} item={item} index={idx + section1.length} onPress={openLesson} />
        ))}
      </ScrollView>

      {/* Bottom nav (placeholder) */}
      <View style={styles.bottomNav}>
        {["🏠","🎒","🎥","🏆","🐟","💬"].map((icon, i) => (
          <TouchableOpacity
            key={i}
            style={styles.navBtn}
            onPress={() => icon === "🏆" && openLeaderboard()}
          >
            <Text style={styles.navIcon}>{icon}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Leaderboard screen
// ──────────────────────────────────────────────────────────────────────────────
function LeaderboardScreen({ onClose }: { onClose: () => void }) {
  return (
    <SafeAreaView style={styles.leaderboardScreen}>
      <View style={styles.trophyRow}>
        {['🥇', '🥈', '🥉'].map((t, i) => (
          <Text key={i} style={styles.trophy}>{t}</Text>
        ))}
      </View>
      <Text style={styles.leaderboardCongrats}>Congratulations! You finished #8 last week.</Text>
      <View style={styles.leaderboardList}>
        {SEED_LEADERBOARD.map((p, i) => (
          <View key={p.name} style={styles.leaderboardItem}>
            <Text style={styles.leaderboardRank}>{i + 1}</Text>
            <Text style={styles.leaderboardAvatar}>{p.avatar}</Text>
            <Text style={styles.leaderboardName}>{p.name}</Text>
            <Text style={styles.leaderboardXP}>{p.xp} XP</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={[styles.cta, { marginTop: 24 }]} onPress={onClose}>
        <Text style={styles.ctaText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
function LessonScreen({
  lesson,
  onBack,
  onCompleteStar,
}: {
  lesson: any;
  onBack: () => void;
  onCompleteStar: () => void;
}) {
  return (
    <SafeAreaView style={styles.lessonScreen}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Text style={styles.backTxt}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.lessonTitle}>{lesson.title}</Text>
      <Text style={styles.lessonHint}>
        Teach credit with micro-challenges: 60–90s cards, tap-to-reveal terms,
        quick quizzes, and “apply it to your life” prompts.
      </Text>

      <TouchableOpacity style={styles.cta} onPress={onCompleteStar}>
        <Text style={styles.ctaText}>Complete Step ★</Text>
      </TouchableOpacity>

      <Text style={styles.lessonStars}>Stars: {lesson.stars}/{lesson.total}</Text>
    </SafeAreaView>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Page (Router entry): toggles between Path and Lesson
// ──────────────────────────────────────────────────────────────────────────────
export default function Page() {
  // Keep lessons in state so we can update stars/unlocks
  const [lessons, setLessons] = useState(SEED_LESSONS);
  const [wallet] = useState(initialWallet);
  const [activeLesson, setActiveLesson] = useState<any | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Open/close lesson
  const openLesson  = useCallback((lesson: any) => setActiveLesson(lesson), []);
  const closeLesson = useCallback(() => setActiveLesson(null), []);

  // When a step completes: +1 star (capped). If done, unlock next lesson.
  const onCompleteStar = useCallback(() => {
    if (!activeLesson) return;
    setLessons((prev) => {
      const idx = prev.findIndex((l) => l.id === activeLesson.id);
      if (idx < 0) return prev;

      const updated = [...prev];
      const l = { ...updated[idx] };
      l.stars = Math.min(l.stars + 1, l.total);
      updated[idx] = l;

      // Unlock next when finished
      const finished = l.stars === l.total;
      if (finished && idx + 1 < updated.length && !updated[idx + 1].unlocked) {
        updated[idx + 1] = { ...updated[idx + 1], unlocked: true };
      }

      // Keep the open lesson in sync
      setActiveLesson(l);

      // TODO: persist to backend/AsyncStorage here
      return updated;
    });
  }, [activeLesson]);

  if (activeLesson) {
    return <LessonScreen lesson={activeLesson} onBack={closeLesson} onCompleteStar={onCompleteStar} />;
  }
  if (showLeaderboard) {
    return <LeaderboardScreen onClose={() => setShowLeaderboard(false)} />;
  }
  return (
    <PathScreen
      lessons={lessons}
      openLesson={openLesson}
      wallet={wallet}
      openLeaderboard={() => setShowLeaderboard(true)}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: THEME.brand.slate },

  topBar: { paddingHorizontal: 16, paddingTop: 10 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 10 },

  statChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.brand.glass,
    borderColor: THEME.brand.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statText: { fontSize: 14, marginRight: 6, color: THEME.text.secondary },
  statValue: { fontWeight: "800", fontSize: 14, color: THEME.text.primary },

  sectionCard: {
    backgroundColor: THEME.brand.glass,
    borderColor: THEME.brand.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
    // nice “glass” effect on web
    ...(Platform.OS === "web" ? { backdropFilter: "blur(8px)" as any } : {}),
  },
  sectionKicker: { color: THEME.text.muted, fontWeight: "700", fontSize: 12, letterSpacing: 1 },
  sectionSubtitle: { color: THEME.text.primary, fontWeight: "900", fontSize: 20, marginTop: 2 },
  sectionProgress: { color: THEME.text.secondary, fontWeight: "600", marginTop: 6 },

  sectionLabel: {
    color: THEME.text.primary,
    fontWeight: "900",
    fontSize: 18,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 4,
  },

  // Path tiles
  tileRow: { height: 140, justifyContent: "flex-start" },
  tileWrap: { position: "absolute" },
  tile: {
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  tileHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  tileEmoji: { fontSize: 22, color: "#fff" },
  tileType: { color: "rgba(255,255,255,0.9)", fontWeight: "800", fontSize: 12, letterSpacing: 1 },
  tileTitle: { color: "white", fontSize: 16, fontWeight: "800", marginTop: 8 },

  starsRow: { flexDirection: "row", gap: 2, marginTop: 10 },
  starGlyph: { fontSize: 13, color: "#fff" },

  bottomNav: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    zIndex: 100,
    ...(Platform.OS === "android" ? { elevation: 10 } : {}),
    height: 66, backgroundColor: THEME.brand.glass,
    borderTopWidth: 1, borderTopColor: THEME.brand.border,
    flexDirection: "row", justifyContent: "space-around", alignItems: "center",
    ...(Platform.OS === "web" ? { backdropFilter: "blur(8px)" as any } : {}),
  },
  navBtn: { padding: 10, borderRadius: 12 },
  navIcon: { fontSize: 20, color: THEME.text.primary },

  lessonScreen: { flex: 1, padding: 16, backgroundColor: THEME.brand.slate },
  backBtn: { marginBottom: 16 },
  backTxt: { fontSize: 16, color: THEME.text.secondary },
  lessonTitle: { fontSize: 22, fontWeight: "900", marginBottom: 8, color: THEME.text.primary },
  lessonHint: { fontSize: 16, color: THEME.text.secondary, lineHeight: 22, marginBottom: 24 },
  cta: { backgroundColor: THEME.brand.gold, padding: 14, borderRadius: 12, alignItems: "center" },
  ctaText: { fontWeight: "900", fontSize: 16, color: THEME.brand.navy },
  lessonStars: { marginTop: 12, fontWeight: "800", color: THEME.text.primary },
  leaderboardScreen: { flex: 1, backgroundColor: THEME.brand.slate, alignItems: "center", padding: 16 },
  trophyRow: { flexDirection: "row", gap: 8, marginTop: 20 },
  trophy: { fontSize: 32 },
  leaderboardCongrats: { marginTop: 20, color: THEME.text.primary, fontWeight: "800", fontSize: 18, textAlign: "center" },
  leaderboardList: { width: "100%", marginTop: 16 },
  leaderboardItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  leaderboardRank: { width: 24, fontWeight: "800", color: THEME.text.primary, fontSize: 16 },
  leaderboardAvatar: { fontSize: 24, marginRight: 8 },
  leaderboardName: { flex: 1, color: THEME.text.primary, fontWeight: "600" },
  leaderboardXP: { color: THEME.text.secondary, fontWeight: "600" },
});
