import type {
  VrmExpression,
  VrmInteractionTarget,
  VrmStageHandle,
  VrmStageSnapshot,
} from '@/components/vrm/vrm-stage.web';

import { Asset } from 'expo-asset';
import { router } from 'expo-router';
import {
  Activity,
  ArrowLeft,
  Box,
  Camera,
  Download,
  Eye,
  FolderOpen,
  Image,
  Music,
  Pause,
  Play,
  RotateCcw,
  ScanSearch,
  Trash2,
} from 'lucide-react';
import * as React from 'react';
import { useAiriVrmStageStore } from '@/components/vrm/airi-vrm-store.web';
import { VrmStage } from '@/components/vrm/vrm-stage.web';

const DEFAULT_MODEL_ASSET = Asset.fromModule(
  require('../../../assets/vrm/models/AvatarSample_A.vrm'),
);
const DEFAULT_ANIMATION_ASSET = Asset.fromModule(
  require('../../../assets/vrm/animations/idle_loop.vrma'),
);
const DEFAULT_HDR_ASSET = Asset.fromModule(
  require('../../../assets/vrm/environment/sky_linekotsi_23_HDRI.hdr'),
);

const DEFAULT_MODEL_URL
  = DEFAULT_MODEL_ASSET.localUri ?? DEFAULT_MODEL_ASSET.uri;
const DEFAULT_ANIMATION_URL
  = DEFAULT_ANIMATION_ASSET.localUri ?? DEFAULT_ANIMATION_ASSET.uri;
const DEFAULT_HDR_URL = DEFAULT_HDR_ASSET.localUri ?? DEFAULT_HDR_ASSET.uri;

const INITIAL_SNAPSHOT: VrmStageSnapshot = {
  animation: 'idle',
  phase: 'idle',
  progress: 0,
  scenePhase: 'pending',
};

const EXPRESSIONS: Array<{ label: string; value: VrmExpression }> = [
  { label: '开心', value: 'happy' },
  { label: '难过', value: 'sad' },
  { label: '生气', value: 'angry' },
  { label: '惊讶', value: 'surprised' },
  { label: '思考', value: 'think' },
  { label: '放松', value: 'relaxed' },
  { label: '复位', value: 'neutral' },
];

function NumberControl({
  label,
  max,
  min,
  onChange,
  step,
  value,
}: {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  value: number;
}) {
  return (
    <label style={styles.rangeRow}>
      <span style={styles.rangeLabel}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={styles.range}
        onChange={event => onChange(Number(event.target.value))}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={Number(value.toFixed(2))}
        style={styles.numberInput}
        onChange={event => onChange(Number(event.target.value))}
      />
    </label>
  );
}

function SegmentedControl<T extends string>({
  onChange,
  options,
  value,
}: {
  onChange: (value: T) => void;
  options: Array<{ label: string; value: T }>;
  value: T;
}) {
  return (
    <div style={styles.segmented}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          style={{
            ...styles.segmentButton,
            ...(option.value === value ? styles.segmentButtonActive : {}),
          }}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function StatusPanel({ snapshot }: { snapshot: VrmStageSnapshot }) {
  const performance = snapshot.performance;
  return (
    <section style={styles.panel}>
      <h2 style={styles.panelTitle}>
        <Activity size={15} />
        运行状态
      </h2>
      <dl style={styles.dataList}>
        {[
          ['场景', snapshot.scenePhase],
          ['模型', snapshot.phase],
          ['动作', snapshot.animation],
          ['缓存', snapshot.cacheHit ? '命中' : '未命中'],
          ['交互', snapshot.interaction ?? '等待点击'],
        ].map(([label, value]) => (
          <div key={label} style={styles.dataRow}>
            <dt style={styles.dataLabel}>{label}</dt>
            <dd style={styles.dataValue}>{value}</dd>
          </div>
        ))}
      </dl>
      {performance && (
        <div style={styles.metricsGrid}>
          {[
            ['FPS', performance.fps],
            ['帧耗时', `${performance.frameMs.toFixed(1)}ms`],
            ['VRM 更新', `${performance.updateMs.toFixed(1)}ms`],
            ['Draw', performance.drawCalls],
            ['Triangles', performance.triangles],
            ['Textures', performance.textures],
          ].map(([label, value]) => (
            <div key={label} style={styles.metric}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// The debug surface keeps all persisted AIRI scene controls visible together.
// eslint-disable-next-line max-lines-per-function
function SettingsPanel({
  stageRef,
}: {
  stageRef: React.RefObject<VrmStageHandle | null>;
}) {
  const state = useAiriVrmStageStore();
  const setValues = state.setStateValues;

  return (
    <>
      <section style={styles.panel}>
        <h2 style={styles.panelTitle}>
          <Eye size={15} />
          视线与表情
        </h2>
        <SegmentedControl
          value={state.trackingMode}
          options={[
            { label: '眼球扫视', value: 'none' },
            { label: '跟随鼠标', value: 'mouse' },
            { label: '看相机', value: 'camera' },
          ]}
          onChange={trackingMode => setValues({ trackingMode })}
        />
        <div style={styles.expressionGrid}>
          {EXPRESSIONS.map(expression => (
            <button
              key={expression.value}
              type="button"
              style={styles.smallButton}
              onClick={() =>
                stageRef.current?.setExpression(expression.value)}
            >
              {expression.label}
            </button>
          ))}
        </div>
      </section>

      <section style={styles.panel}>
        <h2 style={styles.panelTitle}>
          <Image size={15} />
          环境与 NPR IBL
        </h2>
        <SegmentedControl
          value={state.environmentMode}
          options={[
            { label: '半球光', value: 'hemisphere' },
            { label: 'HDR SkyBox', value: 'skyBox' },
          ]}
          onChange={environmentMode => setValues({ environmentMode })}
        />
        <NumberControl
          label="SkyBox 强度"
          min={0}
          max={2}
          step={0.01}
          value={state.skyBoxIntensity}
          onChange={skyBoxIntensity => setValues({ skyBoxIntensity })}
        />
        <NumberControl
          label="环境光"
          min={0}
          max={4}
          step={0.01}
          value={state.ambientLightIntensity}
          onChange={ambientLightIntensity =>
            setValues({ ambientLightIntensity })}
        />
        <NumberControl
          label="方向光"
          min={0}
          max={8}
          step={0.01}
          value={state.directionalLightIntensity}
          onChange={directionalLightIntensity =>
            setValues({ directionalLightIntensity })}
        />
        <NumberControl
          label="半球光"
          min={0}
          max={4}
          step={0.01}
          value={state.hemisphereLightIntensity}
          onChange={hemisphereLightIntensity =>
            setValues({ hemisphereLightIntensity })}
        />
      </section>

      <section style={styles.panel}>
        <h2 style={styles.panelTitle}>
          <Camera size={15} />
          相机与模型
        </h2>
        <NumberControl
          label="FOV"
          min={10}
          max={120}
          step={1}
          value={state.cameraFov}
          onChange={cameraFov => setValues({ cameraFov })}
        />
        <NumberControl
          label="渲染倍率"
          min={0.5}
          max={2}
          step={0.1}
          value={state.renderScale}
          onChange={renderScale => setValues({ renderScale })}
        />
        {(['x', 'y', 'z'] as const).map(axis => (
          <NumberControl
            key={axis}
            label={`模型 ${axis.toUpperCase()}`}
            min={-3}
            max={3}
            step={0.01}
            value={state.modelOffset[axis]}
            onChange={(value) => {
              setValues({
                modelOffset: { ...state.modelOffset, [axis]: value },
              });
            }}
          />
        ))}
        <NumberControl
          label="模型旋转"
          min={-180}
          max={180}
          step={1}
          value={state.modelRotationY}
          onChange={modelRotationY => setValues({ modelRotationY })}
        />
      </section>
    </>
  );
}

// This standalone page is the feature-complete acceptance harness for the runtime.
// eslint-disable-next-line max-lines-per-function
export default function VrmDebugScreen() {
  const [compactLayout, setCompactLayout] = React.useState(
    () => typeof window !== 'undefined' && window.innerWidth < 900,
  );
  const stageRef = React.useRef<VrmStageHandle>(null);
  const stageAreaRef = React.useRef<HTMLElement>(null);
  const modelInputRef = React.useRef<HTMLInputElement>(null);
  const audioInputRef = React.useRef<HTMLInputElement>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const modelObjectUrlRef = React.useRef<string>();
  const audioObjectUrlRef = React.useRef<string>();
  const [modelUrl, setModelUrl] = React.useState(DEFAULT_MODEL_URL);
  const [modelLabel, setModelLabel] = React.useState('AvatarSample_A.vrm');
  const [audioLabel, setAudioLabel] = React.useState('未选择音频');
  const [paused, setPaused] = React.useState(false);
  const [showGrid, setShowGrid] = React.useState(true);
  const [snapshot, setSnapshot] = React.useState(INITIAL_SNAPSHOT);
  const [transparentResult, setTransparentResult]
    = React.useState('尚未检测');
  const [interaction, setInteraction]
    = React.useState<VrmInteractionTarget>();

  React.useEffect(() => {
    const updateLayout = () => setCompactLayout(window.innerWidth < 900);
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  React.useEffect(
    () => () => {
      if (modelObjectUrlRef.current) {
        URL.revokeObjectURL(modelObjectUrlRef.current);
      }
      if (audioObjectUrlRef.current) {
        URL.revokeObjectURL(audioObjectUrlRef.current);
      }
    },
    [],
  );

  const handleInteraction = React.useCallback(
    (target: VrmInteractionTarget) => setInteraction(target),
    [],
  );

  const handleSnapshot = React.useCallback(
    (nextSnapshot: VrmStageSnapshot) => setSnapshot(nextSnapshot),
    [],
  );

  const handleModelFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (modelObjectUrlRef.current) {
      URL.revokeObjectURL(modelObjectUrlRef.current);
    }
    modelObjectUrlRef.current = URL.createObjectURL(file);
    setModelLabel(file.name);
    setSnapshot(INITIAL_SNAPSHOT);
    setModelUrl(modelObjectUrlRef.current);
    event.target.value = '';
  };

  const handleAudioFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    const audio = audioRef.current;
    if (!file || !audio) {
      return;
    }
    if (audioObjectUrlRef.current) {
      URL.revokeObjectURL(audioObjectUrlRef.current);
    }
    audioObjectUrlRef.current = URL.createObjectURL(file);
    audio.src = audioObjectUrlRef.current;
    setAudioLabel(file.name);
    await stageRef.current?.attachAudioElement(audio);
    await audio.play();
    event.target.value = '';
  };

  const loadDefaultModel = () => {
    if (modelObjectUrlRef.current) {
      URL.revokeObjectURL(modelObjectUrlRef.current);
      modelObjectUrlRef.current = undefined;
    }
    setModelLabel('AvatarSample_A.vrm');
    setSnapshot(INITIAL_SNAPSHOT);
    setModelUrl(DEFAULT_MODEL_URL);
  };

  const captureFrame = async () => {
    const blob = await stageRef.current?.captureFrame();
    if (!blob) {
      return;
    }
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `airi-vrm-${Date.now()}.png`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const testCenterAlpha = () => {
    const rect = stageAreaRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    const transparent
      = stageRef.current?.isTransparentAtPoint(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        3,
      ) ?? true;
    setTransparentResult(transparent ? '中心区域透明' : '中心区域有模型像素');
  };

  return (
    <div
      style={{
        ...styles.page,
        ...(compactLayout ? styles.pageCompact : {}),
      }}
    >
      <header
        style={{
          ...styles.header,
          ...(compactLayout ? styles.headerCompact : {}),
        }}
      >
        <button
          type="button"
          title="返回"
          style={styles.iconButton}
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={styles.heading}>
          <strong style={styles.title}>AIRI 3D Runtime</strong>
          <span style={styles.subtitle}>{modelLabel}</span>
        </div>
        <div style={styles.headerActions}>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={loadDefaultModel}
          >
            <Box size={17} />
            默认模型
          </button>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => audioInputRef.current?.click()}
          >
            <Music size={17} />
            口型音频
          </button>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => modelInputRef.current?.click()}
          >
            <FolderOpen size={17} />
            选择 VRM
          </button>
          <input
            ref={modelInputRef}
            type="file"
            accept=".vrm,model/gltf-binary"
            style={styles.hiddenInput}
            onChange={handleModelFile}
          />
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            style={styles.hiddenInput}
            onChange={handleAudioFile}
          />
        </div>
      </header>

      <main
        style={{
          ...styles.workspace,
          ...(compactLayout ? styles.workspaceCompact : {}),
        }}
      >
        <section
          ref={stageAreaRef}
          style={{
            ...styles.stageArea,
            ...(compactLayout ? styles.stageAreaCompact : {}),
          }}
        >
          <VrmStage
            ref={stageRef}
            modelUrl={modelUrl}
            animationUrl={DEFAULT_ANIMATION_URL}
            hdrUrl={DEFAULT_HDR_URL}
            paused={paused}
            showGrid={showGrid}
            onInteract={handleInteraction}
            onSnapshotChange={handleSnapshot}
          />
          {snapshot.phase === 'loading' && (
            <div style={styles.loadingOverlay}>
              <div style={styles.loadingPanel}>
                <strong>正在绑定 AIRI 场景</strong>
                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressValue,
                      width: `${Math.max(snapshot.progress, 3)}%`,
                    }}
                  />
                </div>
                <span>
                  {snapshot.progress}
                  %
                </span>
              </div>
            </div>
          )}
          {snapshot.phase === 'error' && (
            <div style={styles.errorOverlay}>
              <strong>模型加载失败</strong>
              <span>{snapshot.error}</span>
              <button
                type="button"
                style={styles.primaryButton}
                onClick={loadDefaultModel}
              >
                恢复默认模型
              </button>
            </div>
          )}
          <div style={styles.stageToolbar}>
            <button
              type="button"
              title={paused ? '继续播放' : '暂停动作'}
              style={styles.iconButtonDark}
              onClick={() => setPaused(value => !value)}
            >
              {paused ? <Play size={18} /> : <Pause size={18} />}
            </button>
            <button
              type="button"
              title="重置相机"
              style={styles.iconButtonDark}
              onClick={() => stageRef.current?.resetCamera()}
            >
              <RotateCcw size={18} />
            </button>
            <button
              type="button"
              title="导出当前画面"
              style={styles.iconButtonDark}
              onClick={() => void captureFrame()}
            >
              <Download size={18} />
            </button>
            <button
              type="button"
              title="RenderTarget 中心透明检测"
              style={styles.iconButtonDark}
              onClick={testCenterAlpha}
            >
              <ScanSearch size={18} />
            </button>
            <label style={styles.gridToggle}>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={event => setShowGrid(event.target.checked)}
              />
              网格
            </label>
          </div>
        </section>

        <aside
          style={{
            ...styles.sidebar,
            ...(compactLayout ? styles.sidebarCompact : {}),
          }}
        >
          <StatusPanel
            snapshot={{
              ...snapshot,
              interaction: interaction ?? snapshot.interaction,
            }}
          />
          <section style={styles.panel}>
            <h2 style={styles.panelTitle}>
              <Music size={15} />
              wLipSync
            </h2>
            <span style={styles.muted}>{audioLabel}</span>
            <audio ref={audioRef} controls style={styles.audio} />
          </section>
          <SettingsPanel stageRef={stageRef} />
          <section style={styles.panel}>
            <h2 style={styles.panelTitle}>
              <ScanSearch size={15} />
              RenderTarget 拾取
            </h2>
            <span style={styles.muted}>{transparentResult}</span>
          </section>
          <section style={styles.panel}>
            <h2 style={styles.panelTitle}>运行时管理</h2>
            <div style={styles.actionRow}>
              <button
                type="button"
                style={styles.smallButton}
                onClick={() => useAiriVrmStageStore.getState().resetSettings()}
              >
                <RotateCcw size={14} />
                重置设置
              </button>
              <button
                type="button"
                style={styles.smallButton}
                onClick={() => stageRef.current?.clearCache()}
              >
                <Trash2 size={14} />
                清理缓存
              </button>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    height: '100vh',
    minHeight: 600,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#0c1017',
    color: '#f4f7fb',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  pageCompact: {
    height: 'auto',
    minHeight: '100vh',
    overflowY: 'auto',
  },
  header: {
    minHeight: 64,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 18px',
    borderBottom: '1px solid #27303d',
    backgroundColor: '#121822',
  },
  headerCompact: {
    flexWrap: 'wrap',
    padding: 10,
  },
  heading: {
    minWidth: 0,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  title: { fontSize: 16, lineHeight: '22px' },
  subtitle: {
    overflow: 'hidden',
    color: '#96a2b4',
    fontSize: 12,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  headerActions: { display: 'flex', alignItems: 'center', gap: 8 },
  iconButton: {
    width: 38,
    height: 38,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #303a49',
    borderRadius: 6,
    backgroundColor: '#19212d',
    color: '#f4f7fb',
    cursor: 'pointer',
  },
  iconButtonDark: {
    width: 38,
    height: 38,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #3a4657',
    borderRadius: 6,
    backgroundColor: '#171e28',
    color: '#f4f7fb',
    cursor: 'pointer',
  },
  primaryButton: {
    height: 38,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    padding: '0 14px',
    border: '1px solid #59d4a7',
    borderRadius: 6,
    backgroundColor: '#52cfa1',
    color: '#07120e',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  secondaryButton: {
    height: 38,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    padding: '0 12px',
    border: '1px solid #303a49',
    borderRadius: 6,
    backgroundColor: '#19212d',
    color: '#f4f7fb',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  },
  hiddenInput: { display: 'none' },
  workspace: {
    minHeight: 0,
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 370px)',
  },
  workspaceCompact: {
    flex: 'none',
    gridTemplateColumns: 'minmax(0, 1fr)',
  },
  stageArea: {
    minWidth: 0,
    minHeight: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  stageAreaCompact: {
    height: 'min(68vh, 620px)',
    minHeight: 420,
  },
  sidebar: {
    minHeight: 0,
    overflowY: 'auto',
    padding: 14,
    borderLeft: '1px solid #27303d',
    backgroundColor: '#101620',
  },
  sidebarCompact: {
    overflowY: 'visible',
    borderTop: '1px solid #27303d',
    borderLeft: 0,
  },
  panel: {
    padding: '12px 0 16px',
    borderBottom: '1px solid #27303d',
  },
  panelTitle: {
    margin: '0 0 10px',
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    color: '#dce3ed',
    fontSize: 13,
  },
  dataList: { margin: 0 },
  dataRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    padding: '4px 0',
  },
  dataLabel: { color: '#7f8b9d', fontSize: 11 },
  dataValue: {
    margin: 0,
    color: '#eef2f7',
    fontSize: 11,
    textAlign: 'right',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 6,
    marginTop: 10,
  },
  metric: {
    minWidth: 0,
    padding: 7,
    border: '1px solid #2b3544',
    borderRadius: 5,
    backgroundColor: '#151c26',
    color: '#7f8b9d',
    fontSize: 9,
  },
  segmented: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: '1fr',
    gap: 3,
    padding: 3,
    border: '1px solid #2d3746',
    borderRadius: 6,
    backgroundColor: '#0d131c',
  },
  segmentButton: {
    minWidth: 0,
    height: 30,
    border: 0,
    borderRadius: 4,
    backgroundColor: 'transparent',
    color: '#8f9bad',
    fontSize: 10,
    cursor: 'pointer',
  },
  segmentButtonActive: {
    backgroundColor: '#273342',
    color: '#f4f7fb',
  },
  expressionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 6,
    marginTop: 9,
  },
  smallButton: {
    minWidth: 0,
    minHeight: 32,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    padding: '0 8px',
    border: '1px solid #344052',
    borderRadius: 5,
    backgroundColor: '#19212d',
    color: '#e8edf5',
    fontSize: 10,
    cursor: 'pointer',
  },
  rangeRow: {
    display: 'grid',
    gridTemplateColumns: '78px minmax(0, 1fr) 56px',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  rangeLabel: { color: '#9ba7b8', fontSize: 10 },
  range: { minWidth: 0, accentColor: '#52cfa1' },
  numberInput: {
    width: 56,
    height: 27,
    boxSizing: 'border-box',
    border: '1px solid #344052',
    borderRadius: 4,
    backgroundColor: '#0d131c',
    color: '#eef2f7',
    fontSize: 10,
  },
  muted: { color: '#8793a5', fontSize: 10 },
  audio: { width: '100%', height: 34, marginTop: 8 },
  actionRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 },
  stageToolbar: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: 6,
    border: '1px solid #303a49',
    borderRadius: 8,
    backgroundColor: 'rgba(12, 16, 23, 0.9)',
  },
  gridToggle: {
    height: 38,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '0 8px',
    color: '#dce3ed',
    fontSize: 11,
    cursor: 'pointer',
  },
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    backgroundColor: 'rgba(10, 13, 19, 0.22)',
  },
  loadingPanel: {
    width: 300,
    padding: 18,
    border: '1px solid #344052',
    borderRadius: 8,
    backgroundColor: 'rgba(18, 24, 34, 0.94)',
    fontSize: 12,
  },
  progressTrack: {
    height: 5,
    margin: '12px 0 7px',
    overflow: 'hidden',
    borderRadius: 3,
    backgroundColor: '#293342',
  },
  progressValue: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#52cfa1',
  },
  errorOverlay: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 30,
    backgroundColor: 'rgba(12, 16, 23, 0.92)',
    textAlign: 'center',
  },
};
