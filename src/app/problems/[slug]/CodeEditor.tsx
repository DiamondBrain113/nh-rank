"use client";

import { useEffect, useRef } from "react";
import { EditorState, Compartment, Annotation } from "@codemirror/state";
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

const externalUpdate = Annotation.define<boolean>();

interface Props {
  value?: string;
  onChange?: (v: string) => void;
  editable?: boolean;
}

export function CodeEditor({ value = "", onChange, editable = false }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const editableCompartment = useRef(new Compartment());

  useEffect(() => {
    if (!ref.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged && onChange) {
        const isExternal = update.transactions.some(
          (tr) =>
            tr.isUserEvent("input") === false && tr.annotation(externalUpdate)
        );
        if (!isExternal) {
          onChange(update.state.doc.toString());
        }
      }
    });

    const startState = EditorState.create({
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
        editableCompartment.current.of(EditorView.editable.of(editable)),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: ref.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!viewRef.current || value === undefined) return;

    const view = viewRef.current;
    const currentValue = view.state.doc.toString();

    if (value !== currentValue) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value,
        },
        annotations: externalUpdate.of(true),
      });
    }
  }, [value]);

  useEffect(() => {
    if (!viewRef.current) return;
    viewRef.current.dispatch({
      effects: editableCompartment.current.reconfigure(
        EditorView.editable.of(editable)
      ),
    });
  }, [editable]);

  return (
    <div ref={ref} className="h-full w-full overflow-hidden font-jetbrains" />
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
