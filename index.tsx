// app/(tabs)/index.tsx
// Everyday Winners • Credit Path (custom theme)
// Works on iOS/Android/Web (Expo). Beginner-friendly inline comments.

import React, { useMemo, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  Platform,
  Linking,
} from "react-native";
import { Stack } from "expo-router";
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";

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
    case "core":
      return [THEME.brand.teal, THEME.brand.tealDark];
    case "reading":
      return ["#8A5CF6", "#6B46D6"]; // purple family
    case "listening":
      return ["#F97316", "#EA580C"]; // orange family
    case "video":
      return ["#F43F5E", "#E11D48"]; // rose family
    default:
      return [THEME.brand.teal, THEME.brand.tealDark];
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// Fake “economy” (wire to your backend later)
// ──────────────────────────────────────────────────────────────────────────────
const initialWallet = { coins: 10, flames: 0, gems: 189, energy: 25 };

// Default lesson hint copy
const DEFAULT_HINT =
  "Teach credit with micro-challenges: 60–90s cards, tap-to-reveal terms, quick quizzes, and \u201capply it to your life\u201d prompts.";

// Lesson seed data (pretend DB rows)
const SEED_LESSONS = [
  {
    id: "S1P1",
    title: "FCRA 101 Part 1 – Name the Parties",
    type: "reading",
    unlocked: true,
    stars: 0,
    total: 3,
    section: 1,
    hint: DEFAULT_HINT,
  },
  {
    id: "S1P2",
    title: "FCRA 101 Part 2 – Purpose and Scope",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 1,
    hint: DEFAULT_HINT,
  },
  {
    id: "S1P3",
    title: "FCRA 101 Part 3 – Permissible Purpose",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 1,
    hint: DEFAULT_HINT,
  },
  {
    id: "S1P4",
    title: "FCRA 101 Part 4 – Consumer Rights",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 1,
    hint: DEFAULT_HINT,
  },
  {
    id: "S1P5",
    title: "FCRA 101 Part 5 – Furnisher Duties",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 1,
    hint: DEFAULT_HINT,
  },
  {
    id: "S1P6",
    title: "FCRA 101 Part 6 – CRA Duties",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 1,
    hint: DEFAULT_HINT,
  },
  {
    id: "S1P7",
    title: "FCRA 101 Part 7 – Dispute Process",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 1,
    hint: DEFAULT_HINT,
  },
  {
    id: "S1P8",
    title: "FCRA 101 Part 8 – Enforcement",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 1,
    hint: DEFAULT_HINT,
  },
  {
    id: "S1P9",
    title: "FCRA 101 Part 9 – Penalties",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 1,
    hint: DEFAULT_HINT,
  },
  {
    id: "S1P10",
    title: "FCRA 101 Part 10 – Practical Application",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 1,
    hint: DEFAULT_HINT,
  },
  {
    id: "S1Quiz",
    title: "FCRA 101 Quiz",
    type: "core",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 1,
    hint: DEFAULT_HINT,
  },
  {
    id: "S1Workbook",
    title: "FCRA 101 Workbook",
    type: "core",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 1,
    hint: DEFAULT_HINT,
  },
  {
    id: "S2P1",
    title: "FDCPA 101 Part 1 – Overview",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 2,
    hint: DEFAULT_HINT,
  },
  {
    id: "S2P2",
    title: "FDCPA 101 Part 2 – Communication Rules",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 2,
    hint: DEFAULT_HINT,
  },
  {
    id: "S2Quiz",
    title: "FDCPA 101 Quiz",
    type: "core",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 2,
    hint: DEFAULT_HINT,
  },
  {
    id: "S2Workbook",
    title: "FDCPA 101 Workbook",
    type: "core",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 2,
    hint: DEFAULT_HINT,
  },
    {
    id: "S2P1",
    title: "FDCPA 101 Part 1 – Overview",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 3,
    hint: DEFAULT_HINT,
  },
  {
    id: "S2P2",
    title: "FDCPA 101 Part 2 – Communication Rules",
    type: "reading",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 3,
    hint: DEFAULT_HINT,
  },
  {
    id: "S2Quiz",
    title: "FDCPA 101 Quiz",
    type: "core",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 3,
    hint: DEFAULT_HINT,
  },
  {
    id: "S2Workbook",
    title: "FDCPA 101 Workbook",
    type: "core",
    unlocked: false,
    stars: 0,
    total: 3,
    section: 3,
    hint: DEFAULT_HINT,
  },
];

// Leaderboard seed data (pretend weekly XP standings)
const SEED_LEADERBOARD = [
  { name: "Ryan", avatar: "🧔", xp: 862 },
  { name: "Beatriz", avatar: "👩", xp: 480 },
  { name: "Diego", avatar: "👨‍🦱", xp: 266 },
  { name: "Larissa Holanda", avatar: "👩‍🦰", xp: 239 },
  { name: "Mel", avatar: "👩‍🦱", xp: 230 },
];

// Simple movie list using YouTube URLs
const SEED_MOVIES = [
  {
    id: "vid1",
    title: "Credit Basics Explained",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "vid2",
    title: "Understanding the FCRA",
    url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
  },
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

function LoginScreen({ onProceed }: { onProceed: () => void }) {
  // WebView doesn't run on web; show a fallback screen
  if (Platform.OS === "web") {
    return (
      <TouchableOpacity style={styles.webLogin} onPress={onProceed} activeOpacity={1}>
        <Text style={styles.webLoginTitle}>Winners University</Text>
       
      </TouchableOpacity>
    );
  }
  return (
    <WebView
      source={require("./login.html")}
      onMessage={(e) => {
        if (e.nativeEvent.data === "login") onProceed();
      }}
      originWhitelist={["*"]}
      style={{ flex: 1 }}
      scalesPageToFit={false}
    />
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// One path item: **Tile** with gradient (our new look)
// ──────────────────────────────────────────────────────────────────────────────
type LessonTileProps = {
  item: any;
  index: number;
  onPress: (l: any) => void;
  key?: any;
};

function LessonTile({ item, index, onPress }: LessonTileProps) {
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
function PathScreen({ lessons, openLesson, wallet }: any) {
  // Overall progress (stars earned / stars available)
  const progress = useMemo(() => {
    const earned = lessons.reduce((s: number, l: any) => s + l.stars, 0);
    const max    = lessons.reduce((s: number, l: any) => s + l.total, 0);
    return { earned, max, pct: Math.round((earned / max) * 100) || 0 };
  }, [lessons]);

  const section1 = useMemo(() => lessons.filter((l: any) => l.section === 1), [lessons]);
  const section2 = useMemo(() => lessons.filter((l: any) => l.section === 2), [lessons]);
  const section3 = useMemo(() => lessons.filter((l: any) => l.section === 3), [lessons]);


  return (
    <SafeAreaView style={styles.screen}>
      

      {/* Top bar with economy + section header */}
      <View style={styles.topBar}>
        <View style={styles.statsRow}>
          <StatChip label="🪙" value={wallet.coins} />
          <StatChip label="🔥" value={wallet.flames} />
          <StatChip label="💎" value={wallet.gems} />
          <StatChip label="⚡" value={wallet.energy} />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionKicker}>WINNERS ACADEMY</Text>
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
        <Text style={styles.sectionLabel}>Section 3 – GLBA Basics</Text>
        {section3.map((item: any, idx: number) => (
          <LessonTile key={item.id} item={item} index={idx + section2.length} onPress={openLesson} />
        ))}
      </ScrollView>

    </SafeAreaView>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Leaderboard screen
// ──────────────────────────────────────────────────────────────────────────────
function LeaderboardScreen({ onContinue }: { onContinue: () => void }) {
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
      <TouchableOpacity style={[styles.cta, { marginTop: 24 }]} onPress={onContinue}>
        <Text style={styles.ctaText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Simple stats screen shown after leaderboard continue
function StatsScreen({ onClose }: { onClose: () => void }) {
  const stats = { rank: 8, xp: 863, stars: 12 };
  return (
    <SafeAreaView style={styles.leaderboardScreen}>
      <Text style={styles.statsTitle}>Last Week's Stats</Text>
      <View style={styles.leaderboardList}>
        <View style={styles.leaderboardItem}>
          <Text style={styles.leaderboardName}>Rank</Text>
          <Text style={styles.leaderboardXP}>#{stats.rank}</Text>
        </View>
        <View style={styles.leaderboardItem}>
          <Text style={styles.leaderboardName}>XP</Text>
          <Text style={styles.leaderboardXP}>{stats.xp}</Text>
        </View>
        <View style={styles.leaderboardItem}>
          <Text style={styles.leaderboardName}>Stars</Text>
          <Text style={styles.leaderboardXP}>{stats.stars}</Text>
        </View>
      </View>
      <TouchableOpacity style={[styles.cta, { marginTop: 24 }]} onPress={onClose}>
        <Text style={styles.ctaText}>Close</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
function BlankScreen() {
  return <SafeAreaView style={styles.screen} />;
}

function DashboardScreen({ wallet }: { wallet: typeof initialWallet }) {
  const [userName] = useState("Ducky");
  const [deletions] = useState<string[]>([]);
  const [tradelines, setTradelines] = useState<string[]>([]);
  const [recommendedActions, setRecommendedActions] = useState<string[]>([
    "Review your report for errors",
    "Maintain low credit utilization",
  ]);
  const [scores, setScores] = useState({
    experian: null as number | null,
    equifax: null as number | null,
    transunion: null as number | null,
  });
  const [idFile, setIdFile] = useState<string | null>(null);
  const [residencyFile, setResidencyFile] = useState<string | null>(null);

  const pickDocument = async () =>
    DocumentPicker.getDocumentAsync({ type: ["image/*", "application/pdf"] });

  const handleUploadId = async () => {
    const result = await pickDocument();
    if (result.type === "success") {
      setIdFile(result.name || "ID selected");
    }
  };

  const handleUploadResidency = async () => {
    const result = await pickDocument();
    if (result.type === "success") {
      setResidencyFile(result.name || "Proof selected");
    }
  };

  const handleUploadReport = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "text/html" });
    if (result.type === "success") {
      const html = await FileSystem.readAsStringAsync(result.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const matches = html.match(/<li[^>]*>(.*?)<\/li>/g) || [];
      const items = matches.map((m) => m.replace(/<[^>]+>/g, "").trim());
      setTradelines(items);

      const exp = html.match(/Experian[^0-9]*([0-9]{3})/i);
      const equ = html.match(/Equifax[^0-9]*([0-9]{3})/i);
      const tran = html.match(/TransUnion[^0-9]*([0-9]{3})/i);
      setScores({
        experian: exp ? parseInt(exp[1], 10) : null,
        equifax: equ ? parseInt(equ[1], 10) : null,
        transunion: tran ? parseInt(tran[1], 10) : null,
      });

      const recMatches = html.match(/<action[^>]*>(.*?)<\/action>/g) || [];
      if (recMatches.length) {
        const recs = recMatches.map((m) =>
          m.replace(/<[^>]+>/g, "").trim()
        );
        setRecommendedActions(recs);
      }
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.welcomeText}>Hi {userName} 👋</Text>
        <View style={styles.scoresRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Experian</Text>
            <Text style={styles.scoreValue}>
              {scores.experian ?? "--"}
            </Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Equifax</Text>
            <Text style={styles.scoreValue}>{scores.equifax ?? "--"}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>TransUnion</Text>
            <Text style={styles.scoreValue}>
              {scores.transunion ?? "--"}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionKicker}>DELETIONS</Text>
          {deletions.length === 0 && (
            <Text style={styles.reportItem}>No deletions yet</Text>
          )}
          {deletions.map((d, i) => (
            <Text key={i} style={styles.reportItem}>
              • {d}
            </Text>
          ))}
        </View>

        <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadId}>
          <Text style={styles.uploadText}>Upload ID</Text>
        </TouchableOpacity>
        {idFile && <Text style={styles.uploadNote}>{idFile}</Text>}

        <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadResidency}>
          <Text style={styles.uploadText}>Upload Proof of Residency</Text>
        </TouchableOpacity>
        {residencyFile && <Text style={styles.uploadNote}>{residencyFile}</Text>}

        <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadReport}>
          <Text style={styles.uploadText}>Upload Report HTML</Text>
        </TouchableOpacity>

        {tradelines.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionKicker}>TRADLINES</Text>
            {tradelines.map((item, i) => (
              <View key={i} style={styles.tradelineCard}>
                <Text style={styles.tradelineText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {recommendedActions.length > 0 && (
          <View style={[styles.sectionCard, styles.centeredCard]}>
            <Text style={styles.sectionKicker}>RECOMMENDED ACTIONS</Text>
            {recommendedActions.map((a, i) => (
              <Text key={i} style={styles.actionText}>
                • {a}
              </Text>
            ))}
          </View>
        )}

        
      </ScrollView>
    </SafeAreaView>
  );
}

type Message = { id: number; text: string; from: 'support' | 'user'; read: boolean };

function MessagesScreen() {
  const preset = [
    { key: 'dispute', text: 'How do I start a dispute?' },
    { key: 'docs', text: 'What documents do you need?' },
    { key: 'timeline', text: 'How long does each step take?' },
    { key: 'consult', text: 'Can I get a consultation?' },
  ];

  const initialChats: Record<string, Message[]> = {
    dispute: [
      { id: 1, text: 'You can start a dispute from your dashboard.', from: 'support', read: false },
    ],
    docs: [
      { id: 1, text: 'We need a copy of your ID and proof of address.', from: 'support', read: false },
    ],
    timeline: [
      { id: 1, text: 'Each step typically takes 30-45 days.', from: 'support', read: false },
    ],
    consult: [
      { id: 1, text: 'Yes, book a consultation via the link we send.', from: 'support', read: false },
    ],
  };

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [chats, setChats] = useState<Record<string, Message[]>>(initialChats);

  const markRead = (id: number) => {
    if (!selectedReason) return;
    setChats((prev) => ({
      ...prev,
      [selectedReason]: prev[selectedReason].map((m) =>
        m.id === id ? { ...m, read: true } : m
      ),
    }));
  };

  const messages = selectedReason ? chats[selectedReason] : [];

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {selectedReason && (
          <>
            <Text style={styles.sectionSubtitle}>Messages</Text>
            {messages.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => markRead(m.id)}
                style={[
                  styles.messageBubble,
                  m.from === 'user' ? styles.messageOut : styles.messageIn,
                  !m.read && styles.messageUnread,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    m.from !== 'user' && styles.messageTextIn,
                  ]}
                >
                  {m.text}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}
        <View style={{ marginTop: 24 }}>
          <Text style={styles.sectionSubtitle}>Contact Us</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:support@example.com')}>
              <Text style={styles.link}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('tel:+1234567890')}>
              <Text style={styles.link}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginTop: 40, gap: 12, alignItems: 'center' }}>
          {preset.map((q) => (
            <TouchableOpacity
              key={q.key}
              style={styles.questionBtn}
              onPress={() => setSelectedReason(q.key)}
            >
              <Text style={styles.questionText}>{q.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RssFeedScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml"
        );
        const xml = await res.text();
        setItems(parseRSS(xml));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: THEME.text.secondary }}>Loading...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
          {items.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.rssItem}
              onPress={() => Linking.openURL(item.link)}
            >
              <Text style={styles.rssTitle}>{item.title}</Text>
              <Text style={styles.rssDate}>
                {new Date(item.pubDate).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function parseRSS(xml: string) {
  const items = [] as any[];
  const regex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    const item = match[1];
    const titleMatch =
      item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
      item.match(/<title>([\s\S]*?)<\/title>/);
    const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
    const dateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
    items.push({
      title: titleMatch ? titleMatch[1] || titleMatch[2] : "Untitled",
      link: linkMatch ? linkMatch[1].trim() : "",
      pubDate: dateMatch ? dateMatch[1].trim() : "",
    });
  }
  return items;
}

// ──────────────────────────────────────────────────────────────────────────────
// Movies screen: plays YouTube videos
// ──────────────────────────────────────────────────────────────────────────────
function MoviesScreen() {
  const [current, setCurrent] = useState<any | null>(null);

  const embedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  if (current) {
    if (Platform.OS === 'web') {
      return (
        <SafeAreaView style={styles.screen}>
          <TouchableOpacity onPress={() => setCurrent(null)} style={styles.backBtn}>
            <Text style={styles.backTxt}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cta, { marginTop: 16 }]} onPress={() => Linking.openURL(current.url)}>
            <Text style={styles.ctaText}>Open Video</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: THEME.brand.slate }}>
        <TouchableOpacity onPress={() => setCurrent(null)} style={[styles.backBtn, { margin: 16 }]}>
          <Text style={styles.backTxt}>← Back</Text>
        </TouchableOpacity>
        <WebView style={{ flex: 1 }} source={{ uri: embedUrl(current.url) }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {SEED_MOVIES.map((m) => (
          <TouchableOpacity key={m.id} style={styles.videoItem} onPress={() => setCurrent(m)}>
            <Text style={styles.videoTitle}>{m.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
      <Text style={styles.lessonHint}>{lesson.hint}</Text>

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
  const [showLogin, setShowLogin] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [tab, setTab] = useState<'home' | 'messages' | 'rss' | 'movies' | 'path'>('home');
  const insets = useSafeAreaInsets();


  // Open/close lesson
  const openLesson  = useCallback((lesson: any) => setActiveLesson(lesson), []);
  const closeLesson = useCallback(() => setActiveLesson(null), []);

  const openLeaderboard = useCallback(() => {
    setShowStats(false);
    setShowLeaderboard(true);
  }, []);
  const goToStats = useCallback(() => {
    setShowLeaderboard(false);
    setShowStats(true);
  }, []);
  const closeStats = useCallback(() => setShowStats(false), []);
  const closeOverlays = useCallback(() => {
    setShowLeaderboard(false);
    setShowStats(false);
  }, []);

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

  let content;
  if (showLogin) content = <LoginScreen onProceed={() => setShowLogin(false)} />;
  else if (showLeaderboard) content = <LeaderboardScreen onContinue={goToStats} />;
  else if (showStats) content = <StatsScreen onClose={closeStats} />;
  else if (activeLesson) content = <LessonScreen lesson={activeLesson} onBack={closeLesson} onCompleteStar={onCompleteStar} />;
  else if (tab === 'home') content = <DashboardScreen wallet={wallet} />;
  else if (tab === 'messages') content = <MessagesScreen />;
  else if (tab === 'rss') content = <RssFeedScreen />;
  else if (tab === 'movies') content = <MoviesScreen />;
  else if (tab === 'path') content = <PathScreen lessons={lessons} openLesson={openLesson} wallet={wallet} />;
  else content = <BlankScreen />;

  return (
    <>
      {content}
      {!showLogin && !activeLesson && (
        <View
          style={[
            styles.bottomNav,
            { paddingBottom: insets.bottom, height: 66 + insets.bottom, zIndex: 10 },
          ]}
        >
          {[ 
            { icon: '🏠', action: () => { closeOverlays(); setTab('home'); } },
            { icon: '🎒', action: () => { closeOverlays(); setTab('path'); } },
            { icon: '🎥', action: () => { closeOverlays(); setTab('movies'); } },
            { icon: '🏆', action: openLeaderboard },
            { icon: '📰', action: () => { closeOverlays(); setTab('rss'); } },
            { icon: '💬', action: () => { closeOverlays(); setTab('messages'); } },

          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.navBtn} onPress={item.action}>
              <Text style={styles.navIcon}>{item.icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
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

  welcomeText: { color: THEME.text.primary, fontSize: 18, fontWeight: "900" },
  scoresRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  scoreCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: THEME.brand.glass,
    borderColor: THEME.brand.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  scoreLabel: { color: THEME.text.secondary, fontSize: 12 },
  scoreValue: { color: THEME.text.primary, fontSize: 20, fontWeight: "700" },
  uploadBtn: {
    marginTop: 16,
    backgroundColor: THEME.brand.teal,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadText: { color: THEME.brand.navy, fontWeight: "700" },
  uploadNote: {
    color: THEME.text.secondary,
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  reportItem: { color: THEME.text.primary, marginTop: 4 },

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
  centeredCard: { alignItems: "center" },
  actionText: { color: THEME.text.primary, marginTop: 4, textAlign: "center" },
  tradelineCard: {
    backgroundColor: THEME.brand.glass,
    borderColor: THEME.brand.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  tradelineText: { color: THEME.text.primary },

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

  // Leaderboard screen
  leaderboardScreen: {
    flex: 1,
    backgroundColor: THEME.brand.slate,
    padding: 24,
    paddingBottom: 120,
  },
  trophyRow: { flexDirection: "row", justifyContent: "center", gap: 16, marginBottom: 16 },
  trophy: { fontSize: 40 },
  leaderboardCongrats: {
    color: THEME.text.primary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },
  leaderboardList: { gap: 8, alignSelf: "stretch" },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.brand.glass,
    borderColor: THEME.brand.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  leaderboardRank: { width: 24, fontWeight: "700", color: THEME.text.primary },
  leaderboardAvatar: { width: 32, fontSize: 20 },
  leaderboardName: { flex: 1, fontWeight: "600", color: THEME.text.primary },
  leaderboardXP: { fontWeight: "600", color: THEME.text.secondary },
  statsTitle: {
    color: THEME.text.primary,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginBottom: 8,
    maxWidth: '80%',
  },
  messageOut: {
    alignSelf: 'flex-end',
    backgroundColor: '#0A84FF',
  },
  messageIn: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageUnread: { opacity: 0.8 },
  messageText: { color: '#fff' },
  messageTextIn: { color: '#000' },

  link: { color: THEME.brand.teal, fontWeight: "700", fontSize: 16 },
  questionBtn: {
    backgroundColor: THEME.brand.teal,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignSelf: 'center',
    maxWidth: '80%',
  },
  questionText: { color: '#fff', fontWeight: "600" },

  videoItem: {
    backgroundColor: THEME.brand.glass,
    borderColor: THEME.brand.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  videoTitle: { color: THEME.text.primary, fontWeight: "700", fontSize: 16 },

  rssItem: {
    backgroundColor: THEME.brand.glass,
    borderColor: THEME.brand.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 4,
  },
  rssTitle: { color: THEME.text.primary, fontWeight: "700", fontSize: 16 },
  rssDate: { color: THEME.text.secondary, fontSize: 12 },

  bottomNav: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    zIndex: 100,
    ...(Platform.OS === "android" ? { elevation: 10 } : {}),
    height: 66, backgroundColor: THEME.brand.glass,
    borderTopWidth: 1, borderTopColor: THEME.brand.border,
    flexDirection: "row", justifyContent: "space-around", alignItems: "center",
    ...(Platform.OS === "web" ? { backdropFilter: "blur(8px)" as any } : {}),
    elevation: 4,
  },
  navBtn: { padding: 10, borderRadius: 12 },
  navIcon: { fontSize: 20, color: THEME.text.primary },

  // Fallback login screen for web
  webLogin: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.brand.slate,
    padding: 16,
  },
  webLoginTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: THEME.text.primary,
    marginBottom: 24,
  },

  lessonScreen: { flex: 1, padding: 16, backgroundColor: THEME.brand.slate },
  backBtn: { marginBottom: 16 },
  backTxt: { fontSize: 16, color: THEME.text.secondary },
  lessonTitle: { fontSize: 22, fontWeight: "900", marginBottom: 8, color: THEME.text.primary },
  lessonHint: { fontSize: 16, color: THEME.text.secondary, lineHeight: 22, marginBottom: 24 },
  cta: { backgroundColor: THEME.brand.gold, padding: 14, borderRadius: 12, alignItems: "center" },
  ctaText: { fontWeight: "900", fontSize: 16, color: THEME.brand.navy },
  lessonStars: { marginTop: 12, fontWeight: "800", color: THEME.text.primary },

});
