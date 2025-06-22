"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"

type EggType = "soft" | "medium" | "hard"
type View = "main" | "timer"

const eggOptions = {
  soft: { label: "Lembek (Soft Boiled)", time: 360, image: "/softboiled1.gif" },
  medium: {
    label: "Medium (Medium Boiled)",
    time: 480,
    image: "/softboiled.gif",
  },
  hard: { label: "Matang (Hard Boiled)", time: 600, image: "/hardboiled.gif" },
}

export default function EggTimer() {
  const [currentView, setCurrentView] = useState<View>("main")
  const [selectedEgg, setSelectedEgg] = useState<EggType | null>(null)
  const [showCookingGuide, setShowCookingGuide] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [totalTime, setTotalTime] = useState(0)
  const [guideModalOpen, setGuideModalOpen] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setIsRunning(false)
            // Three beeps when timer reaches zero
            return 0
          }
          // Single beep every 2 minutes (120 seconds)
          if (time % 120 === 0) {
            // Beep sound would be triggered here
          }
          return time - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleEggSelection = (value: string) => {
    setSelectedEgg(value as EggType)
    setShowCookingGuide(true)
  }

  const handleStartTimer = () => {
    if (selectedEgg) {
      const time = eggOptions[selectedEgg].time
      setTimeLeft(time)
      setTotalTime(time)
      setCurrentView("timer")
      setIsRunning(true)
    }
  }

  const handlePauseResume = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(0)
    setTotalTime(0)
    setCurrentView("main")
    setSelectedEgg(null)
    setShowCookingGuide(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progressValue = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {currentView === "main" && (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Egg Boil Timer</CardTitle>
            <p className="text-muted-foreground">Choose your desired egg doneness</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tingkat Kematangan</label>
              <Select onValueChange={handleEggSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tingkat kematangan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soft">Lembek (Soft Boiled)</SelectItem>
                  <SelectItem value="medium">Medium (Medium Boiled)</SelectItem>
                  <SelectItem value="hard">Matang (Hard Boiled)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <img
                src={selectedEgg ? eggOptions[selectedEgg].image : "/placeholder.svg?height=200&width=200&text=Egg"}
                alt="Egg illustration"
                className="w-48 h-48 object-contain rounded-lg"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleStartTimer} disabled={!selectedEgg} className="flex-1">
                Pilih
              </Button>
              {showCookingGuide && (
                <Dialog open={guideModalOpen} onOpenChange={setGuideModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="flex-1">
                      Cara Memasak
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Panduan Memasak Telur</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Bagaimana cara memasak telur lembek (soft boiled)?</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <p>
                                <strong>Waktu:</strong> 6-7 menit
                              </p>
                              <p>
                                <strong>Hasil:</strong> Putih telur matang, kuning telur cair
                              </p>
                              <p>
                                <strong>Tips:</strong> Langsung masukkan ke air es setelah matang untuk menghentikan
                                proses memasak. Kupas dengan hati-hati karena putih telur masih lembut.
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>Bagaimana cara memasak telur medium?</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <p>
                                <strong>Waktu:</strong> 8-9 menit
                              </p>
                              <p>
                                <strong>Hasil:</strong> Putih telur matang, kuning telur setengah cair (jammy)
                              </p>
                              <p>
                                <strong>Tips:</strong> Ideal untuk ramen atau salad. Kuning telur akan berwarna orange
                                keemasan dan tekstur creamy.
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger>Bagaimana cara memasak telur matang (hard boiled)?</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <p>
                                <strong>Waktu:</strong> 10-12 menit
                              </p>
                              <p>
                                <strong>Hasil:</strong> Putih dan kuning telur matang sempurna
                              </p>
                              <p>
                                <strong>Tips:</strong> Jangan terlalu lama agar kuning telur tidak berwarna kehijauan.
                                Cocok untuk telur devil atau sandwich.
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                          <AccordionTrigger>Apakah suhu awal telur berpengaruh?</AccordionTrigger>
                          <AccordionContent>
                            Ya, sangat berpengaruh. Telur yang langsung dari kulkas membutuhkan waktu lebih lama sekitar
                            1-2 menit. Sebaiknya diamkan telur di suhu ruang selama 10-15 menit sebelum direbus untuk
                            hasil yang konsisten.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                          <AccordionTrigger>Tips agar telur tidak retak saat direbus</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <p>• Masukkan telur perlahan ke air mendidih menggunakan sendok</p>
                              <p>• Gunakan api sedang, bukan api besar</p>
                              <p>• Pastikan air cukup untuk menutupi telur sepenuhnya</p>
                              <p>• Buat lubang kecil di ujung telur dengan jarum (opsional)</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-6">
                          <AccordionTrigger>Bagaimana cara mengupas telur dengan mudah?</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              <p>• Langsung masukkan telur ke air es setelah matang</p>
                              <p>• Diamkan dalam air es selama 2-3 menit</p>
                              <p>• Ketuk-ketuk seluruh permukaan telur hingga retak</p>
                              <p>• Mulai kupas dari ujung yang lebih besar</p>
                              <p>• Kupas di bawah air mengalir untuk hasil yang lebih mudah</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Panduan Lengkap Memasak Telur</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl mb-2">🌡️</div>
                            <div className="font-medium">Suhu Air Ideal</div>
                            <div className="text-sm text-muted-foreground">100°C (Mendidih)</div>
                          </div>
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl mb-2">🥚</div>
                            <div className="font-medium">Suhu Awal Telur</div>
                            <div className="text-sm text-muted-foreground">Suhu Ruang</div>
                          </div>
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <div className="text-2xl mb-2">🍳</div>
                            <div className="font-medium">Ukuran Panci</div>
                            <div className="text-sm text-muted-foreground">Sedang</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium">Langkah-langkah Memasak:</h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                                1
                              </div>
                              <div>
                                <p className="font-medium">Persiapan</p>
                                <p className="text-sm text-muted-foreground">
                                  Keluarkan telur dari kulkas 10-15 menit sebelum memasak
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                                2
                              </div>
                              <div>
                                <p className="font-medium">Didihkan Air</p>
                                <p className="text-sm text-muted-foreground">
                                  Isi panci dengan air secukupnya, didihkan dengan api besar
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                                3
                              </div>
                              <div>
                                <p className="font-medium">Masukkan Telur</p>
                                <p className="text-sm text-muted-foreground">
                                  Masukkan telur perlahan dengan sendok, kecilkan api menjadi sedang
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                                4
                              </div>
                              <div>
                                <p className="font-medium">Timer</p>
                                <p className="text-sm text-muted-foreground">
                                  Nyalakan timer sesuai tingkat kematangan yang diinginkan
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                                5
                              </div>
                              <div>
                                <p className="font-medium">Air Es</p>
                                <p className="text-sm text-muted-foreground">
                                  Siapkan mangkuk berisi air es untuk menghentikan proses memasak
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                                6
                              </div>
                              <div>
                                <p className="font-medium">Selesai</p>
                                <p className="text-sm text-muted-foreground">
                                  Angkat telur dan langsung masukkan ke air es, diamkan 2-3 menit
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">💡 Tips Pro:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Gunakan telur yang sudah berumur 7-10 hari untuk hasil kupas yang lebih mudah</li>
                            <li>• Tambahkan 1 sdm cuka ke air rebusan untuk mencegah telur retak</li>
                            <li>• Simpan telur rebus di kulkas maksimal 1 minggu</li>
                            <li>• Untuk telur lembek, konsumsi segera setelah matang</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {currentView === "timer" && selectedEgg && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Timer untuk Telur {eggOptions[selectedEgg].label.split(" ")[0]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-8">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold mb-4">{formatTime(timeLeft)}</div>
                  <div className="w-full max-w-sm mx-auto">
                    <Progress value={progressValue} className="h-3" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1 max-w-xs">
                <Button onClick={handlePauseResume} className="w-full" variant={isRunning ? "secondary" : "default"}>
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </>
                  )}
                </Button>
                <Button onClick={handleReset} variant="outline" className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
