declare module "@tiptap/react" {
    interface Commands<ReturnType> {
      heading: {
        toggleHeading: (attributes: { level: number }) => ReturnType
      }
    }
  }
  
  