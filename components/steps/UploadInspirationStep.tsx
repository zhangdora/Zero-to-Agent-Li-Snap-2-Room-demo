"use client";

import { useState } from "react";
import { useWorkflow } from "@/lib/workflow-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Upload, ImageIcon, Sparkles, Palette, Layers, Layout } from "lucide-react";
import { AgentProgressPanel } from "@/components/common/AgentProgressPanel";

export function UploadInspirationStep() {
  const { state, dispatch, generateAssets } = useWorkflow();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(state.inspirationUploaded);

  const handleUseSample = () => {
    dispatch({ type: "SET_INSPIRATION_UPLOADED", payload: true });
    setHasUploaded(true);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2500));
    generateAssets();
    setIsGenerating(false);
    dispatch({ type: "NEXT_STEP" });
  };

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" });
  };

  if (isGenerating) {
    return <AgentProgressPanel />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-stone-900">Upload the Living Room You Love</h2>
        <p className="text-stone-500 mt-1">
          Snap2Room will extract furniture, layout, and style from your reference image.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Upload Area */}
        <div className="space-y-6">
          {/* Drag & Drop Zone */}
          <Card className={hasUploaded ? "border-green-300 bg-green-50" : ""}>
            <CardContent className="pt-6">
              <div
                className={`
                  border-2 border-dashed rounded-xl p-8 text-center transition-colors
                  ${hasUploaded ? "border-green-400 bg-green-50" : "border-stone-300 hover:border-stone-400 bg-stone-50"}
                `}
              >
                {hasUploaded ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-xl bg-green-100 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Sample Inspiration Loaded</p>
                      <p className="text-sm text-green-600">warm-minimal-living-room.jpg</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-xl bg-stone-100 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-stone-400" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-700">Drag & drop your inspiration image</p>
                      <p className="text-sm text-stone-500">or click to browse</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sample Image Option */}
          {!hasUploaded && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-8 h-8 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-stone-900">Use Sample Inspiration</p>
                    <p className="text-sm text-stone-500">
                      Try our warm minimal living room example
                    </p>
                  </div>
                  <Button variant="secondary" onClick={handleUseSample}>
                    Use Sample
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Philosophy Card */}
          <Card className="bg-stone-900 text-white">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">
                  AI is not giving you more choices. It is reading what you already like.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Detected Style (shown after upload) */}
        <div className="space-y-6">
          {hasUploaded && state.detectedStyle ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detected Style</CardTitle>
                <CardDescription>Extracted from your inspiration image</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Style</p>
                    <p className="font-medium">{state.detectedStyle.style}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Colours</p>
                    <div className="flex gap-1.5 mt-1">
                      {state.detectedStyle.colors.map((color) => (
                        <Badge key={color} variant="secondary" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Materials</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {state.detectedStyle.materials.map((material) => (
                        <Badge key={material} variant="secondary" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Layout className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-500">Layout</p>
                    <p className="text-sm leading-relaxed">{state.detectedStyle.layout}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : hasUploaded ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-amber-600" />
                  </div>
                  <p className="font-medium text-stone-900">Ready to analyze</p>
                  <p className="text-sm text-stone-500 mt-1">
                    Click &quot;Generate Furniture Assets&quot; to extract style and furniture
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-stone-100 flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-stone-400" />
                  </div>
                  <p className="font-medium text-stone-400">Upload an image first</p>
                  <p className="text-sm text-stone-400 mt-1">
                    We&apos;ll extract style, colors, and layout
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handleBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleGenerate}
          size="lg"
          className="gap-2"
          disabled={!hasUploaded}
        >
          Generate Furniture Assets
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
