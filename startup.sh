#/bin/bash
curl -fsSL https://ollama.com/install.sh | sh
nohup ollama serve &
ollama run qwen3.5:cloud

curl -fsSL https://openclaw.ai/install.sh | bash
openclaw onboard --install-daemon
