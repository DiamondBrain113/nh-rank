"use client";

import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  highlightActiveLine,
} from "@codemirror/view";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { cpp } from "@codemirror/lang-cpp";
import { search, searchKeymap } from "@codemirror/search";
import { draculaHighlight, draculaTheme } from "@/lib/draculaTheme";

interface Props {
  value?: string;
  onChange?: (v: string) => void;
  editable?: boolean;
}

export function CodeEditor({ value = "", onChange, editable = false }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const text = update.state.doc.toString();
        onChange?.(text);
      }
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        cpp(),
        search(),
        lineNumbers(),
        highlightSpecialChars(),
        highlightActiveLine(),
        keymap.of([indentWithTab, ...defaultKeymap, ...searchKeymap]),
        EditorView.lineWrapping,
        draculaTheme,
        draculaHighlight,
        updateListener,
        EditorView.editable.of(editable),
      ],
    });

    const view = new EditorView({
      state,
      parent: ref.current,
    });

    viewRef.current = view;

    return () => view.destroy();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full h-full flex-1 font-jetbrains overflow-x-hidden overflow-y-auto"
    />
  );
}

export function PlainEditor({ value = "", onChange, editable = false }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const text = update.state.doc.toString();
        onChange?.(text);
      }
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        search(),
        lineNumbers(),
        highlightSpecialChars(),
        highlightActiveLine(),
        keymap.of([indentWithTab, ...defaultKeymap, ...searchKeymap]),
        EditorView.lineWrapping,
        draculaTheme,
        draculaHighlight,
        updateListener,
        EditorView.editable.of(editable),
      ],
    });

    const view = new EditorView({
      state,
      parent: ref.current,
    });

    viewRef.current = view;

    return () => view.destroy();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full h-full flex-1 font-jetbrains overflow-x-hidden overflow-y-auto"
    />
  );
}
