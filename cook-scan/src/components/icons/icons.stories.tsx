import type { Meta, StoryObj } from '@storybook/nextjs'
import React from 'react'
import { MemoIcon } from './memo-icon'
import { ErrorIcon } from './error-icon'
import { HomeIcon } from './home-icon'
import { ReloadIcon } from './reload-icon'
import { SearchIcon } from './search-icon'
import { CloseIcon } from './close-icon'
import { PlusIcon } from './plus-icon'
import { TrashIcon } from './trash-icon'
import { EmptyIcon } from './empty-icon'
import { WarningIcon } from './warning-icon'
import { BookIcon } from './book-icon'
import { SadFaceIcon } from './sad-face-icon'
import { SpinnerIcon } from './spinner-icon'
import { ChevronLeftIcon } from './chevron-left-icon'
import { InfoCircleIcon } from './info-circle-icon'
import { CheckCircleIcon } from './check-circle-icon'
import { XCircleIcon } from './x-circle-icon'
import { ExclamationCircleIcon } from './exclamation-circle-icon'
import { InfoSolidIcon } from './info-solid-icon'
import { LogoutIcon } from './logout-icon'
import { MailIcon } from './mail-icon'
import { LockIcon } from './lock-icon'
import { LoginIcon } from './login-icon'
import { UserAddIcon } from './user-add-icon'
import { CameraIcon } from './camera-icon'
import { ListIcon } from './list-icon'
import { TagIcon } from './tag-icon'
import { ChevronRightIcon } from './chevron-right-icon'
import { UserIcon } from './user-icon'
import { EnvelopeIcon } from './envelope-icon'
import { UserCircleIcon } from './user-circle-icon'
import { CheckIcon } from './check-icon'
import { KeyIcon } from './key-icon'
import { ShieldCheckIcon } from './shield-check-icon'
import { CheckCircleOutlineIcon } from './check-circle-outline-icon'
import { ClockIcon } from './clock-icon'
import { StopCircleIcon } from './stop-circle-icon'
import { PencilIcon } from './pencil-icon'
import { DownloadIcon } from './download-icon'
import { PhotographIcon } from './photograph-icon'
import { ExclamationTriangleIcon } from './exclamation-triangle-icon'
import { BeakerIcon } from './beaker-icon'
import { BookOpenIcon } from './book-open-icon'
import { DocumentTextIcon } from './document-text-icon'
import { DocumentIcon } from './document-icon'
import { LinkIcon } from './link-icon'
import { ClipboardListIcon } from './clipboard-list-icon'
import { PlayIcon } from './play-icon'
import { PauseIcon } from './pause-icon'
import { CheckSolidIcon } from './check-solid-icon'
import { FilterIcon } from './filter-icon'
import { DocumentSearchIcon } from './document-search-icon'
import { CloudUploadIcon } from './cloud-upload-icon'
import { AdjustmentsIcon } from './adjustments-icon'
import { CheckCircleSolidIcon } from './check-circle-solid-icon'
import { LightningBoltIcon } from './lightning-bolt-icon'
import { ClipboardIcon } from './clipboard-icon'
import { FolderIcon } from './folder-icon'
import { UserCircleSolidIcon } from './user-circle-solid-icon'
import { ExclamationTriangleSolidIcon } from './exclamation-triangle-solid-icon'
import { BadgeCheckIcon } from './badge-check-icon'
import { MenuIcon } from './menu-icon'

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
