# 承認ワークフロービジュアルエディタ / Approval Workflow Visual Editor

Web-based visual workflow editor that outputs BPMN 2.0 XML. Design approval workflows by dragging and dropping nodes and connecting them with edges.

## 🌟 Features

- **Visual Flow Editor**: Drag-and-drop interface using React Flow
- **Custom Nodes**: Start, Approval, Condition, and End nodes
- **Assignee Management**: Assign multiple users to approval nodes
- **Approval Rules**: Configure all/any/majority approval logic
- **BPMN 2.0 Export**: Generate standards-compliant BPMN XML
- **Save/Load**: Persist workflows using LocalStorage
- **Real-time Preview**: See your workflow as you build it

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Flow** - Visual flow editor library
- **Zustand** - State management
- **React Icons** - Icon library

### Data Format
- **BPMN 2.0 XML** - Standard workflow format

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/okab130/wkflowXml.git
   cd wkflowXml/workflow-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage

### Creating a Workflow

1. **Add Nodes**: Drag nodes from the left sidebar to the canvas
   - Start Node: Beginning of the workflow
   - Approval Node: Requires user approval
   - Condition Node: Branch based on conditions
   - End Node: End of the workflow

2. **Connect Nodes**: Click and drag from one node's handle to another to create edges

3. **Configure Approval Nodes**:
   - Select an approval node
   - In the right panel, assign users
   - Set approval rules (all/any/majority)

4. **Export to BPMN**: Click "Export XML" to download BPMN 2.0 format

### Managing Assignees

1. Open the Assignee Manager
2. Add users with name, email, role, and department
3. Assign users to approval nodes

### Saving Workflows

- **Save**: Store your workflow in browser LocalStorage
- **Load**: Retrieve previously saved workflows
- **Export/Import**: Share workflows as JSON files

## 📁 Project Structure

```
workflow-editor/
├── src/
│   ├── components/
│   │   ├── nodes/          # Custom node components
│   │   ├── edges/          # Custom edge components
│   │   ├── sidebar/        # Sidebar components
│   │   └── toolbar/        # Toolbar components
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── styles/             # CSS styles
│   ├── App.tsx             # Main application
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Node Types

| Node Type | Icon | Description |
|-----------|------|-------------|
| Start | ⭕ | Workflow starting point |
| Approval | 📝 | User approval task |
| Condition | ◇ | Conditional branching |
| End | ⬛ | Workflow endpoint |

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint for linting
- Prettier for formatting
- TypeScript strict mode enabled

## 📝 BPMN 2.0 Output

The editor generates BPMN 2.0 compliant XML with:
- Process definitions
- Start/End events
- User tasks (approval nodes)
- Sequence flows
- Exclusive gateways (condition nodes)
- Lane/Pool information (assignees)

## 🗺️ Roadmap

- [X] Phase 1: Basic flow editor
- [X] Phase 2: Assignee management
- [X] Phase 3: BPMN XML output
- [X] Phase 4: Save/load functionality
- [ ] Phase 5: Backend API integration
- [ ] Phase 6: Collaboration features
- [ ] Phase 7: Version control

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Authors

- [@okab130](https://github.com/okab130)

## 🙏 Acknowledgments

- [React Flow](https://reactflow.dev/) - Powerful flow editor library
- [BPMN 2.0](https://www.omg.org/spec/BPMN/2.0/) - Business Process Model and Notation standard
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

## 📞 Support

For issues and questions, please use the [GitHub Issues](https://github.com/okab130/wkflowXml/issues) page.

---

Made with ❤️ using React + TypeScript + Vite
