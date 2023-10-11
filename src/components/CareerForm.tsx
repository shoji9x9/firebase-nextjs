import { messageAtom } from "@/states/messageAtom";
import { LoginUser } from "@/states/userAtom";
import { techStacks } from "@/types/techStacks";
import { Career, CareerFieldArray, TechStack } from "@/types/types";
import {
  exceptionMessage,
  infoMessage,
  successMessage,
} from "@/utils/messages";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Switch,
  TextField,
  Theme,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { ReactNode, useEffect } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { useSetRecoilState } from "recoil";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { saveCareer } from "@/services/saveCareer";
import { deleteCareer } from "@/services/deleteCareer";

export function CareerForm({
  career,
  register,
  handleSubmit,
  errors,
  control,
  watch,
  setValue,
  index,
  loginUser,
  deleteForm,
}: {
  career: Career;
  register: UseFormRegister<CareerFieldArray>;
  handleSubmit: UseFormHandleSubmit<CareerFieldArray, undefined>;
  errors: FieldErrors<CareerFieldArray>;
  control: Control<CareerFieldArray, any>;
  watch: UseFormWatch<CareerFieldArray>;
  setValue: UseFormSetValue<CareerFieldArray>;
  index: number;
  loginUser?: LoginUser;
  deleteForm: (idx: number) => void;
}) {
  const setMessageAtom = useSetRecoilState(messageAtom);

  console.log("CareerForm: ", career);

  const onSubmit: SubmitHandler<CareerFieldArray> = async (data) => {
    try {
      const _data = data.fieldArray[index];
      await saveCareer(_data, loginUser);
      setMessageAtom((prev) => {
        return {
          ...prev,
          ...successMessage("Saved"),
        };
      });
      // TODO: dirtyでないようにする。現状、Saveボタン押下してもdirtyのままになってしまっている
    } catch (error) {
      setMessageAtom((prev) => {
        return {
          ...prev,
          ...exceptionMessage(),
        };
      });
    }
  };

  const onDelete: SubmitHandler<CareerFieldArray> = async (data) => {
    try {
      const _data = data.fieldArray[index];
      if (_data.id) {
        await deleteCareer(_data.id, loginUser);
        deleteForm(index);
        setMessageAtom((prev) => {
          return {
            ...prev,
            ...successMessage("Deleted"),
          };
        });
      } else {
        setMessageAtom((prev) => {
          return {
            ...prev,
            ...infoMessage("Not saved yet"),
          };
        });
      }
    } catch (error) {
      setMessageAtom((prev) => {
        return {
          ...prev,
          ...exceptionMessage(),
        };
      });
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      },
    },
  };

  const theme = useTheme();

  function getStyles(
    name: string,
    techStacks: readonly TechStack[],
    theme: Theme
  ) {
    return {
      fontWeight:
        techStacks.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const startYearMonthsWatch = watch(`fieldArray.${index}.startYearMonth`);
  useEffect(() => {
    // React Hook Formを再描画させるために、nullをセットしている
    if (startYearMonthsWatch === null) {
      setValue(`fieldArray.${index}.startYearMonth`, null);
    }
  }, [startYearMonthsWatch]);

  const endYearMonthsWatch = watch(`fieldArray.${index}.endYearMonth`);
  useEffect(() => {
    // React Hook Formを再描画させるために、nullをセットしている
    if (endYearMonthsWatch === null) {
      setValue(`fieldArray.${index}.endYearMonth`, null);
    }
  }, [endYearMonthsWatch]);

  return (
    <Box>
      <Stack spacing={2}>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid item>
            <IconButton
              aria-label="edit"
              name={register(`fieldArray.${index}.isEditing`).name}
              ref={register(`fieldArray.${index}.isEditing`).ref}
              onClick={() => {
                setValue(`fieldArray.${index}.isEditing`, true);
              }}
              disabled={!!watch(`fieldArray.${index}.isEditing`)}
            >
              <ModeEditIcon />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton
              aria-label="delete"
              // TODO: データ登録済の場合のみdisabledを解除する
              disabled={!!watch(`fieldArray.${index}.isEditing`)}
              onClick={handleSubmit(onDelete)}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
        <TextField
          variant="outlined"
          label="Project name"
          required
          {...register(`fieldArray.${index}.projectName`)}
          error={!!errors.fieldArray?.[index]?.projectName}
          helperText={
            errors.fieldArray?.[index]?.projectName?.message as ReactNode
          }
          disabled={!watch(`fieldArray.${index}.isEditing`)}
        />
        <Grid container columnSpacing={2} alignItems="center">
          <Grid item xs={4} sx={{ paddingLeft: "0 !important" }}>
            <FormControlLabel
              control={
                <Switch
                  // refを利用すると表示時の値がundefinedになったため利用しない
                  // {...register(`fieldArray.${index}.isPresent`)}
                  name={register(`fieldArray.${index}.isPresent`).name}
                  onChange={(e) => {
                    // 以下を利用するとスイッチを一度操作するときは問題ないが、二度目以降の操作で値が変更されないため利用しない
                    // register(`fieldArray.${index}.isPresent`).onChange(e);
                    setValue(`fieldArray.${index}.isPresent`, e.target.checked);
                  }}
                  onBlur={register(`fieldArray.${index}.isPresent`).onBlur}
                  checked={watch(`fieldArray.${index}.isPresent`) || false}
                  disabled={
                    !watch(`fieldArray.${index}.isEditing`) ||
                    !!watch(`fieldArray.${index}.endYearMonth`)
                  }
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Present job"
            />
          </Grid>
          <Grid item xs={4}>
            <Controller
              name={`fieldArray.${index}.startYearMonth`}
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Start date"
                  slotProps={{
                    textField: {
                      required: true,
                      error: !!errors.fieldArray?.[index]?.startYearMonth,
                      helperText: errors.fieldArray?.[index]?.startYearMonth
                        ?.message as ReactNode,
                    },
                    field: {
                      clearable: true,
                    },
                  }}
                  onChange={(value) => {
                    field.onChange(value);
                    field.onBlur();
                  }}
                  views={["month", "year"]}
                  disabled={!watch(`fieldArray.${index}.isEditing`)}
                />
              )}
            />
          </Grid>

          <Grid item xs={4}>
            <Controller
              name={`fieldArray.${index}.endYearMonth`}
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="End date"
                  slotProps={{
                    textField: {
                      error: !!errors.fieldArray?.[index]?.endYearMonth,
                      helperText: errors.fieldArray?.[index]?.endYearMonth
                        ?.message as ReactNode,
                    },
                    field: { clearable: true },
                  }}
                  onChange={(value) => {
                    field.onChange(value);
                    field.onBlur();
                  }}
                  views={["month", "year"]}
                  disabled={
                    !watch(`fieldArray.${index}.isEditing`) ||
                    watch(`fieldArray.${index}.isPresent`)
                  }
                />
              )}
            />
          </Grid>
        </Grid>
        <FormControl>
          <InputLabel id="tech-stack-label">Tech stack</InputLabel>
          <Select
            {...register(`fieldArray.${index}.techStack`)}
            value={watch(`fieldArray.${index}.techStack`) || []}
            labelId="tech-stack-label"
            multiple
            input={
              <OutlinedInput id="select-multiple-chip" label="Tech stack" />
            }
            renderValue={(selected: TechStack[]) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
            disabled={!watch(`fieldArray.${index}.isEditing`)}
          >
            {techStacks.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(
                  name,
                  watch(`fieldArray.${index}.techStack`) || [],
                  theme
                )}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label="Summary"
          {...register(`fieldArray.${index}.summary`)}
          error={!!errors.fieldArray?.[index]?.summary}
          helperText={errors.fieldArray?.[index]?.summary?.message as ReactNode}
          multiline
          rows={5}
          disabled={!watch(`fieldArray.${index}.isEditing`)}
        />
        <TextField
          type="number"
          variant="outlined"
          label="Team size"
          {...register(`fieldArray.${index}.teamSize`)}
          error={!!errors.fieldArray?.[index]?.teamSize}
          helperText={
            errors.fieldArray?.[index]?.teamSize?.message as ReactNode
          }
          disabled={!watch(`fieldArray.${index}.isEditing`)}
        />
        <Box>
          <Button
            variant="outlined"
            disabled={!watch(`fieldArray.${index}.isEditing`)}
            onClick={() => setValue(`fieldArray.${index}.isEditing`, false)}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="ml-2"
            onClick={handleSubmit(onSubmit)}
            disabled={!watch(`fieldArray.${index}.isEditing`)}
          >
            Save
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
