import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mic, Square, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const MAX_DURATION_SECONDS = 60;

type RecordingStatus = "idle" | "recording" | "processing";

declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
};

const buildSummary = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "";
  const slice = words.slice(0, 24).join(" ");
  return words.length > 24 ? `${slice}…` : slice;
};

export default function VoiceSocialPage() {
  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [secondsLeft, setSecondsLeft] = useState(MAX_DURATION_SECONDS);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [recognitionAvailable, setRecognitionAvailable] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const progressValue = useMemo(() => {
    const elapsed = MAX_DURATION_SECONDS - secondsLeft;
    return (elapsed / MAX_DURATION_SECONDS) * 100;
  }, [secondsLeft]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    recognitionRef.current?.stop();
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
    setStatus("processing");
    clearTimer();
  }, []);

  const startRecording = useCallback(async () => {
    setAudioUrl(null);
    setTranscript("");
    setSummary("");
    setSecondsLeft(MAX_DURATION_SECONDS);
    setStatus("recording");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.addEventListener("dataavailable", event => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    });

    recorder.addEventListener("stop", () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setStatus("idle");
    });

    recorder.start(200);

    const RecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (RecognitionConstructor) {
      const recognition = new RecognitionConstructor();
      recognition.lang = "tr-TR";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = event => {
        const result = Array.from(event.results)
          .map(resultItem => resultItem[0]?.transcript)
          .filter(Boolean)
          .join(" ");
        setTranscript(result.trim());
      };
      recognitionRef.current = recognition;
      recognition.start();
    } else {
      setRecognitionAvailable(false);
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopRecording]);

  useEffect(() => {
    return () => {
      clearTimer();
      recognitionRef.current?.stop();
      mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleGenerateSummary = () => {
    setSummary(buildSummary(transcript));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sesli Paylaşım Laboratuvarı</h2>
        <p className="text-muted-foreground">
          Sadece sesle çalışan sosyal medya akışımız için 1 dakikalık kayıt oluşturun, metne dönüştürün ve özetini alın.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kayıt Kontrolü</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={status === "recording" ? stopRecording : startRecording}
              className="gap-2"
            >
              {status === "recording" ? (
                <>
                  <Square className="h-4 w-4" /> Kaydı Durdur
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" /> Kayıt Başlat
                </>
              )}
            </Button>
            <div className="text-sm text-muted-foreground">
              Maksimum süre: 1 dakika • Kalan: {formatTime(secondsLeft)}
            </div>
          </div>
          <Progress value={progressValue} />
          {audioUrl && (
            <audio controls src={audioUrl} className="w-full" />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Ses Tanıma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={transcript}
              placeholder="Kayıt sırasında konuşmanız metne dönüşecek..."
              rows={10}
              readOnly
            />
            {!recognitionAvailable && (
              <p className="text-sm text-muted-foreground">
                Tarayıcınız yerel ses tanımayı desteklemiyor. Kaydı tamamladıktan sonra manuel metin girebilirsiniz.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Özet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={summary}
              placeholder="Kısa özet burada görünecek..."
              rows={10}
              readOnly
            />
            <Button
              onClick={handleGenerateSummary}
              disabled={!transcript.trim()}
              className="gap-2"
            >
              <Wand2 className="h-4 w-4" /> Özet Oluştur
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
