export interface IssueForm {
  category: string;
  title: string;
  description: string;
  relatedComponent: boolean;
  componentName: string;
  version: string;
  environment: string;
  reproductionLink: string;
  reproductionSteps: string;
  expectedBehavior: string;
  actualBehavior: string;
}

export interface CategoryOption {
  label: string;
  value: string;
}

export interface FormRules {
  title: Array<{
    required: boolean;
    message: string;
    trigger: string;
    min?: number;
  }>;
  category: Array<{ required: boolean; message: string; trigger: string }>;
  version: Array<{ required: boolean; message: string; trigger: string }>;
  reproductionSteps: Array<{
    required: boolean;
    message: string;
    trigger: string;
    min?: number;
  }>;
  expectedBehavior: Array<{
    required: boolean;
    message: string;
    trigger: string;
    min?: number;
  }>;
  actualBehavior: Array<{
    required: boolean;
    message: string;
    trigger: string;
    min?: number;
  }>;
}
