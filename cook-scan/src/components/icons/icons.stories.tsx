import type { Meta, StoryObj } from 'storybook'
import React from 'react'
import {
  MemoIcon,
  ErrorIcon,
  HomeIcon,
  ReloadIcon,
  SearchIcon,
  CloseIcon,
  PlusIcon,
  TrashIcon,
  EmptyIcon,
  WarningIcon,
  BookIcon,
  SadFaceIcon,
  SpinnerIcon,
  ChevronLeftIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  InfoSolidIcon,
  LogoutIcon,
  MailIcon,
  LockIcon,
  LoginIcon,
  UserAddIcon,
  CameraIcon,
  ListIcon,
  TagIcon,
  ChevronRightIcon,
  UserIcon,
  EnvelopeIcon,
  UserCircleIcon,
  CheckIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckCircleOutlineIcon,
  ClockIcon,
  StopCircleIcon,
  PencilIcon,
  DownloadIcon,
  PhotographIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  BookOpenIcon,
  DocumentTextIcon,
  DocumentIcon,
  LinkIcon,
  ClipboardListIcon,
  PlayIcon,
  PauseIcon,
  CheckSolidIcon,
  FilterIcon,
  DocumentSearchIcon,
  CloudUploadIcon,
  AdjustmentsIcon,
  CheckCircleSolidIcon,
  LightningBoltIcon,
  ClipboardIcon,
  FolderIcon,
  UserCircleSolidIcon,
  ExclamationTriangleSolidIcon,
  BadgeCheckIcon,
  MenuIcon,
} from './index'

const allIcons = {
  MemoIcon,
  ErrorIcon,
  HomeIcon,
  ReloadIcon,
  SearchIcon,
  CloseIcon,
  PlusIcon,
  TrashIcon,
  EmptyIcon,
  WarningIcon,
  BookIcon,
  SadFaceIcon,
  SpinnerIcon,
  ChevronLeftIcon,
  InfoCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  InfoSolidIcon,
  LogoutIcon,
  MailIcon,
  LockIcon,
  LoginIcon,
  UserAddIcon,
  CameraIcon,
  ListIcon,
  TagIcon,
  ChevronRightIcon,
  UserIcon,
  EnvelopeIcon,
  UserCircleIcon,
  CheckIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckCircleOutlineIcon,
  ClockIcon,
  StopCircleIcon,
  PencilIcon,
  DownloadIcon,
  PhotographIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  BookOpenIcon,
  DocumentTextIcon,
  DocumentIcon,
  LinkIcon,
  ClipboardListIcon,
  PlayIcon,
  PauseIcon,
  CheckSolidIcon,
  FilterIcon,
  DocumentSearchIcon,
  CloudUploadIcon,
  AdjustmentsIcon,
  CheckCircleSolidIcon,
  LightningBoltIcon,
  ClipboardIcon,
  FolderIcon,
  UserCircleSolidIcon,
  ExclamationTriangleSolidIcon,
  BadgeCheckIcon,
  MenuIcon,
}

const meta = {
  title: 'Icons/Gallery',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-6 gap-4">
      {Object.entries(allIcons).map(([name, Icon]) => (
        <div
          key={name}
          className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 hover:bg-muted"
        >
          <Icon className="h-6 w-6 text-gray-700" />
          <span className="text-[10px] text-muted-foreground">{name.replace('Icon', '')}</span>
        </div>
      ))}
    </div>
  ),
}

export const IconSizes: Story = {
  render: () => {
    const sizes = [
      { label: '16px', cls: 'h-4 w-4' },
      { label: '20px', cls: 'h-5 w-5' },
      { label: '24px', cls: 'h-6 w-6' },
      { label: '32px', cls: 'h-8 w-8' },
      { label: '48px', cls: 'h-12 w-12' },
    ]
    return (
      <div className="flex items-end gap-8">
        {sizes.map(({ label, cls }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <HomeIcon className={`${cls} text-primary`} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    )
  },
}

export const IconColors: Story = {
  render: () => {
    const colors = [
      { label: 'Primary', cls: 'text-primary' },
      { label: 'Secondary', cls: 'text-secondary' },
      { label: 'Danger', cls: 'text-danger' },
      { label: 'Warning', cls: 'text-warning' },
      { label: 'Success', cls: 'text-success' },
      { label: 'Muted', cls: 'text-muted-foreground' },
    ]
    return (
      <div className="flex items-center gap-8">
        {colors.map(({ label, cls }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <HomeIcon className={`h-8 w-8 ${cls}`} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    )
  },
}

export const NavigationIcons: Story = {
  render: () => {
    const icons = { HomeIcon, ChevronLeftIcon, ChevronRightIcon, MenuIcon, SearchIcon, FilterIcon }
    return (
      <div className="grid grid-cols-6 gap-4">
        {Object.entries(icons).map(([name, Icon]) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4"
          >
            <Icon className="h-6 w-6 text-gray-700" />
            <span className="text-[10px] text-muted-foreground">{name.replace('Icon', '')}</span>
          </div>
        ))}
      </div>
    )
  },
}

export const ActionIcons: Story = {
  render: () => {
    const icons = {
      PlusIcon,
      PencilIcon,
      TrashIcon,
      DownloadIcon,
      CloudUploadIcon,
      CloseIcon,
      ReloadIcon,
      CameraIcon,
      LinkIcon,
      ClipboardIcon,
    }
    return (
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(icons).map(([name, Icon]) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4"
          >
            <Icon className="h-6 w-6 text-gray-700" />
            <span className="text-[10px] text-muted-foreground">{name.replace('Icon', '')}</span>
          </div>
        ))}
      </div>
    )
  },
}

export const StatusIcons: Story = {
  render: () => {
    const icons = {
      CheckCircleIcon,
      CheckCircleSolidIcon,
      XCircleIcon,
      ExclamationCircleIcon,
      ExclamationTriangleIcon,
      InfoCircleIcon,
      InfoSolidIcon,
      WarningIcon,
      ErrorIcon,
      BadgeCheckIcon,
    }
    return (
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(icons).map(([name, Icon]) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4"
          >
            <Icon className="h-6 w-6 text-gray-700" />
            <span className="text-[10px] text-muted-foreground">{name.replace('Icon', '')}</span>
          </div>
        ))}
      </div>
    )
  },
}

export const RecipeIcons: Story = {
  render: () => {
    const icons = {
      BookOpenIcon,
      BookIcon,
      DocumentTextIcon,
      DocumentIcon,
      ClipboardListIcon,
      TagIcon,
      ClockIcon,
      BeakerIcon,
      PlayIcon,
      PauseIcon,
      StopCircleIcon,
      PhotographIcon,
    }
    return (
      <div className="grid grid-cols-6 gap-4">
        {Object.entries(icons).map(([name, Icon]) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4"
          >
            <Icon className="h-6 w-6 text-gray-700" />
            <span className="text-[10px] text-muted-foreground">{name.replace('Icon', '')}</span>
          </div>
        ))}
      </div>
    )
  },
}
