# TraceBite

A food production traceability web app that tracks each batch from raw materials through cooking to dispatch, so any batch can be traced back to its source.

Built with React by Rupin Reddy (@rupinreddy27-gif) and @peram-vignesh.

## Features

- **Role-based dashboards** for four roles: General Manager, Raw Material Manager, Cook Manager, and Dispatch Manager
- **Batch tracking:** create batches, view batch details, and follow each batch's status
- **Trace search:** look up a batch and see its full history
- **Raw material approvals:** approve or reject incoming raw materials
- **QA templates:** reusable quality-check templates for batches
- **Admin panel** and protected routes behind a login

## Tech stack

- React 19, React Router 7
- Lucide icons
- Mock data layer (`src/data/mockData.js`) in place of a backend for now

## Project structure

```
src/
  components/   Sidebar, Topbar, BatchCard, StatCard, StatusBadge
  pages/        Dashboards, Batches, NewBatch, BatchDetail, SearchTrace, QATemplates, Admin, Login
  data/         Mock data
```

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000.

## Roadmap

- Connect to a real database and API
- Deploy a live demo
- Add screenshots to this README
